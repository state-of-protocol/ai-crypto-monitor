const DEEPSEEK_API_KEY = () => process.env.DEEPSEEK_API_KEY;

let isQuotaExceeded = false;
let quotaExceededAt = 0;
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000;

export function isDeepSeekAvailable(): boolean {
  if (isQuotaExceeded) {
    const expired = Date.now() - quotaExceededAt > QUOTA_COOLDOWN_MS;
    if (expired) {
      isQuotaExceeded = false;
      console.log("♻️ DeepSeek quota cooldown elapsed, retrying.");
    } else {
      return false;
    }
  }
  const key = DEEPSEEK_API_KEY();
  if (!key) {
    console.warn("⚠️ DEEPSEEK_API_KEY not set. AI features will use simulation mode.");
    return false;
  }
  return true;
}

function handleDeepSeekError(error: unknown) {
  const errStr = String(error);
  if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("rate limit")) {
    if (!isQuotaExceeded) {
      isQuotaExceeded = true;
      quotaExceededAt = Date.now();
    }
  }
}

export async function deepseekChat(prompt: string, systemInstruction?: string): Promise<string | null> {
  const key = DEEPSEEK_API_KEY();
  if (!key || isQuotaExceeded) return null;

  const messages: { role: string; content: string }[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`DeepSeek API ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    handleDeepSeekError(error);
    throw error;
  }
}

export async function deepseekJson<T>(prompt: string, systemInstruction?: string): Promise<T | null> {
  const text = await deepseekChat(prompt, systemInstruction);
  if (!text) return null;
  try {
    const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("Failed to parse DeepSeek JSON response:", text.slice(0, 200));
    return null;
  }
}
