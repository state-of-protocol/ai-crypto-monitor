# Format: id|symbol|name|price|supply|cap|vol|ch24h|ch1h|ch7d
# For exact data (ranks 1-10): all 10 fields provided
# For estimated data (ranks 11-400): only first 5 fields, rest are computed
$rawData = @'
bitcoin|BTC|Bitcoin|77547.65|20030000|1553472771556|28126621244|2.35|0.42|5.81
ethereum|ETH|Ethereum|2134.14|120680000|257560169679|14752998703|-1.23|0.15|-3.42
tether|USDT|Tether|0.9992|189840000000|189695839765|69383002330|0.01|0.00|0.02
bnb|BNB|BNB|656.22|134780000|88449263524|1246906811|0.45|0.23|1.85
ripple|XRP|XRP|1.37|61820000000|85050211634|1761361500|-0.78|0.12|2.15
usd-coin|USDC|USDC|0.9999|76080000000|76082925798|11042340350|0.01|0.00|0.01
solana|SOL|Solana|87.42|577980000|50530210938|3886821243|1.56|0.34|4.72
tron|TRX|TRON|0.3641|94800000000|34519035941|764230327|-0.23|0.08|1.12
wbt|WBT|WhiteBIT Coin|10.50|142857143|1500000000|15000000|0.12|0.05|0.85
dogecoin|DOGE|Dogecoin|0.1055|154330000000|16295578597|907520037|-1.85|0.22|6.34
zcash|ZEC|Zcash|65.42|16400000
cardano|ADA|Cardano|0.65|35000000000
bitcoin-cash|BCH|Bitcoin Cash|420|19800000
monero|XMR|Monero|175|18400000
chainlink|LINK|Chainlink|18|608000000
canton|CC|Canton|0.80|1800000000
toncoin|TONCOIN|Toncoin|5.50|2500000000
dai|DAI|Dai|1.00|3500000000
stellar|XLM|Stellar|0.22|30000000000
sui|SUI|Sui|2.80|2500000000
litecoin|LTC|Litecoin|95|75000000
avalanche-2|AVAX|Avalanche|22|400000000
hedera-hashgraph|HBAR|Hedera Hashgraph|0.12|38000000000
shiba-inu|SHIB|Shiba Inu|0.000018|589000000000000
near|NEAR|NEAR Protocol|4.50|1200000000
bittensor|TAO|Bittensor|350|8000000
mantle|MNT|Mantle|0.85|3300000000
uniswap|UNI|Uniswap|8.50|600000000
polkadot|DOT|Polkadot|5.80|1500000000
paypal-usd|PYUSD|PayPal USD|1.00|1000000000
cronos|CRO|Cronos|0.12|26000000000
pepe|PEPE|Pepe|0.000008|420000000000000
ondo|ONDO|Ondo|1.80|1400000000
ethereum-classic|ETC|Ethereum Classic|22|148000000
aave|AAVE|Aave|185|15000000
pax-gold|PAXG|PAX Gold|2380|200000
dexe|DEXE|DeXe|12|100000000
first-digital-usd|FDUSD|First Digital USD|1.00|2000000000
internet-computer|ICP|Internet Computer|7.50|470000000
polygon-ecosystem-token|POL|Polygon Ecosystem Token|0.38|10000000000
algorand|ALGO|Algorand|0.28|8200000000
render-token|RENDER|Render Token|5.50|370000000
kaspa|KAS|Kaspa|0.12|25000000000
worldcoin|WLD|Worldcoin|1.50|5000000000
just|JST|JUST|0.055|9900000000
quant|QNT|Quant|85|12000000
gatechain-token|GT|Gatechain Token|15|90000000
cosmos|ATOM|Cosmos|6.50|390000000
aptos|APT|Aptos|6.80|480000000
filecoin|FIL|Filecoin|4.20|530000000
arbitrum|ARB|Arbitrum|0.65|1300000000
gnosis|GNO|Gnosis|280|2500000
dash|DASH|Dash|32|11900000
kucoin-shares|KCS|KuCoin Shares|12|90000000
vechain|VET|VeChain|0.035|72500000000
injective|INJ|Injective Protocol|14|86000000
fetch-ai|FET|Artificial Superintelligence Alliance|1.20|2400000000
pendle|PENDLE|Pendle|3.80|250000000
trueusd|TUSD|TrueUSD|1.00|500000000
virtual-protocol|VIRTUAL|Virtual Protocol|2.80|400000000
nexo|NEXO|Nexo|1.80|560000000
xdc-network|XDC|XDC Network|0.045|38000000000
pancakeswap|CAKE|PancakeSwap|2.80|280000000
stacks|STX|Stacks|1.50|1800000000
luna-classic|LUNC|Luna Classic|0.000065|5800000000000
aerodrome|AERO|Aerodrome|1.20|800000000
chiliz|CHZ|Chiliz|0.095|8800000000
celestia|TIA|Celestia|5.50|450000000
official-trump|TRUMP|OFFICIAL TRUMP|12|200000000
bonk|BONK|Bonk|0.000018|72000000000000
flare|FLR|Flare|0.028|28000000000
spx6900|SPX|SPX6900|0.85|850000000
immutable-x|IMX|Immutable X|1.10|1600000000
curve-dao-token|CRV|Curve DAO Token|0.55|1900000000
tezos|XTZ|Tezos|0.80|1000000000
olympus|OHM|Olympus|12|20000000
ethereum-name-service|ENS|Ethereum Name Service|22|31000000
ether-fi|ETHFI|ether.fi governance token|2.80|180000000
telcoin|TEL|Telcoin|0.018|52000000000
bittorrent|BTT|BitTorrent|0.0000008|960000000000000
decred|DCR|Decred|25|14500000
lido-dao|LDO|Lido DAO|1.80|890000000
bitcoin-sv|BSV|Bitcoin SV|55|19700000
floki-inu|FLOKI|Floki Inu|0.000085|97000000000000
neo|NEO|NEO|12|65000000
jupiter|JUP|Jupiter|0.85|1300000000
maker|MKR|Maker|1450|975000
optimism|OP|Optimism|1.20|1100000000
jasmycoin|JASMY|JasmyCoin|0.018|47500000000
apenft|NFT|APENFT|0.0000005|990000000000000
frax|FRAX|Frax|1.00|600000000
jito|JTO|Jito|3.50|130000000
polygon|MATIC|Polygon|0.42|9300000000
syrup-token|SYRUP|Syrup Token|0.18|2000000000
akash-network|AKT|Akash Network|2.80|250000000
the-graph|GRT|The Graph|0.14|9500000000
origintrail|TRAC|OriginTrail|0.65|400000000
axie-infinity|AXS|Axie Infinity|5.50|146000000
compound|COMP|Compound|55|8500000
rsk-smart-bitcoin|RBTC|RSK Smart Bitcoin|65000|10000
raydium|RAY|Raydium|2.50|250000000
theta-token|THETA|Theta Network|1.80|1000000000
fartcoin|FARTCOIN|Fartcoin|0.85|1000000000
dogwifhat|WIF|dogwifhat|0.65|1000000000
decentraland|MANA|Decentraland|0.35|1900000000
the-sandbox|SAND|The Sandbox|0.32|1600000000
reserve-rights|RSR|Reserve Rights|0.012|50000000000
centrifuge|CFG|Centrifuge|0.55|450000000
eos|EOS|EOS|0.65|1100000000
onyxcoin|XCN|Onyxcoin|0.035|20000000000
vicicoin|VCNT|ViciCoin|18|10000000
zano|ZANO|Zano|8.50|10000000
mx-token|MX|MX Token|3.80|100000000
convex-finance|CVX|Convex Finance|3.20|80000000
trust-wallet-token|TWT|Trust Wallet Token|1.20|400000000
iota|MIOTA|IOTA|0.28|2800000000
thorchain|RUNE|THORChain|4.50|330000000
ecash|XEC|eCash|0.000035|19500000000000
basic-attention-token|BAT|Basic Attention Token|0.18|1500000000
mai|MIMATIC|MAI|0.85|100000000
sei-network|SEI|Sei Network|0.42|2500000000
gala|GALA|Gala|0.028|35000000000
1inch|1INCH|1inch|0.35|1200000000
fantom|FTM|Fantom|0.55|2800000000
multiversx|EGLD|MultiversX|35|27000000
conflux-token|CFX|Conflux Token|0.18|3800000000
helium|HNT|Helium|4.50|160000000
wemix-token|WEMIX|Wemix Token|0.85|350000000
golem|GLM|Golem|0.32|1000000000
horizen|ZEN|Horizen|12|15000000
apecoin|APE|ApeCoin|0.85|560000000
synthetix|SNX|Synthetix|1.80|300000000
qtum|QTUM|Qtum|3.50|105000000
shuffle|SHFL|Shuffle|0.35|500000000
arweave|AR|Arweave|18|66000000
beam|BEAM|Beam|0.018|50000000000
xpr-network|XPR|XPR Network|0.0012|25000000000
0x|ZRX|0x|0.35|850000000
qubic|QUBIC|QUBIC|0.000002|100000000000000
ordinals|ORDI|Ordinals|25|21000000
aioz-network|AIOZ|AIOZ Network|0.75|1100000000
enjin-coin|ENJ|Enjin Coin|0.18|1800000000
yearn-finance|YFI|yearn.finance|8500|37000
dusk-network|DUSK|Dusk Network|0.28|500000000
amp|AMP|Amp|0.0035|80000000000
baby-doge-coin|BABYDOGE|Baby Doge Coin|0.000000002|200000000000000000
theta-fuel|TFUEL|Theta Fuel|0.065|5300000000
brett|BRETT|Brett|0.085|10000000000
orca|ORCA|Orca|2.80|100000000
turbo|TURBO|Turbo|0.0085|65000000000
dog-go-to-the-moon|DOG|DOG•GO•TO•THE•MOON|0.012|100000000000
creditcoin|CTC|Creditcoin|0.85|300000000
rsk-infrastructure-framework|RIF|RSK Infrastructure Framework|0.12|1000000000
superverse|SUPER|SuperVerse|0.85|300000000
mina-protocol|MINA|Mina Protocol|0.55|1100000000
gmx|GMX|GMX|28|8500000
holo-token|HOT|Holo Token|0.0018|170000000000
request-network|REQ|Request Network|0.12|1000000000
pirate-chain|ARRR|PirateChain|0.35|150000000
polymesh|POLYX|Polymesh|0.28|600000000
alchemy-pay|ACH|Alchemy Pay|0.018|7500000000
digibyte|DGB|DigiByte|0.0085|17000000000
kava|KAVA|Kava|0.55|1000000000
blur|BLUR|Blur|0.28|1800000000
pyth-network|PYTH|Pyth Network|0.35|3500000000
ontology|ONT|Ontology|0.22|370000000
sushi|SUSHI|Sushi|0.85|250000000
pax-dollar|USDP|Pax Dollar|1.00|500000000
uma|UMA|UMA|2.80|75000000
nano|XNO|Nano|0.85|130000000
coinex-token|CET|CoinEx Token|0.075|2000000000
axelar|AXL|Axelar|0.85|1000000000
ravencoin|RVN|Ravencoin|0.018|14000000000
verge|XVG|Verge|0.0055|16500000000
popcat|POPCAT|Popcat|0.65|1000000000
oasis-network|ROSE|Oasis Network|0.065|9500000000
vvs-finance|VVS|VVS Finance|0.0000035|45000000000000
mog-coin|MOG|Mog Coin|0.0000015|500000000000000
xyo-network|XYO|XYO Network|0.012|7000000000
bitmart-token|BMX|BitMart Token|0.35|200000000
nervos-network|CKB|Nervos Network|0.012|44000000000
siacoin|SC|Siacoin|0.0045|56000000000
cat-in-a-dogs-world|MEW|cat in a dogs world|0.0085|88000000000
astar|ASTR|ASTAR|0.085|7000000000
notcoin|NOT|Notcoin|0.012|100000000000
big-time|BIGTIME|Big Time|0.12|1000000000
waves|WAVES|Waves|1.80|115000000
tellor|TRB|Tellor|65|2500000
bitcoin-gold|BTG|Bitcoin Gold|35|10500000
storj|STORJ|Storj|0.55|400000000
venus|XVS|Venus|6.50|17000000
status|SNT|Status|0.035|6800000000
casper-network|CSPR|Casper Network|0.018|10000000000
hegic|HEGIC|Hegic|0.028|1000000000
zilliqa|ZIL|Zilliqa|0.018|18000000000
gas|GAS|Gas|3.50|13000000
neiro|NEIRO|Neiro|0.065|10000000000
frax-share|FXS|Frax Share|2.80|75000000
iotex|IOTX|IoTeX|0.035|10000000000
book-of-meme|BOME|BOOK OF MEME|0.0085|69000000000
illuvium|ILV|Illuvium|35|4700000
decentralized-social|DESO|Decentralized Social|12|10000000
osmosis|OSMO|Osmosis|0.85|550000000
ecomi|OMI|ECOMI|0.0012|550000000000
ardor|ARDR|Ardor|0.085|1000000000
snek|SNEK|Snek|0.0065|80000000000
wiki-cat|WKC|WIKI CAT|0.035|10000000000
bancor|BNT|Bancor|0.85|120000000
blockv|VEE|BLOCKv|0.012|3000000000
binance-usd|BUSD|Binance USD|1.00|500000000
atone|ATONE|Atone|0.035|1000000000
iexec-rlc|RLC|iExec RLC|1.80|87000000
flow|FLOW|Flow|0.85|550000000
power-ledger|POWR|Power Ledger|0.28|500000000
pundi-x|PUNDIX|Pundi X|0.35|200000000
core-dao|CORE|Core DAO|1.20|500000000
mask-network|MASK|Mask Network|2.50|100000000
manta-network|MANTA|Manta Network|0.85|350000000
solv-protocol|SOLV|Solv Protocol|0.12|5000000000
celo-dollar|CUSD|Celo Dollar|1.00|100000000
mango|MNGO|Mango|0.028|1000000000
terraclassicusd|USTC|TerraClassicUSD|0.018|8000000000
skale|SKL|SKALE|0.035|5000000000
propy|PRO|Propy|1.80|100000000
bounce|AUCTION|Bounce|22|10000000
stargate-finance|STG|Stargate Finance|0.55|200000000
rocket-pool|RPL|Rocket Pool|18|20000000
icon|ICX|ICON|0.18|1000000000
tokamak-network|TON|Tokamak|0.65|50000000
constellation|DAG|Constellation|0.035|3000000000
woo-network|WOO|Wootrade Network|0.18|2000000000
deapecoin|DEP|DEAPCOIN|0.0018|50000000000
origin-protocol|OGN|Origin Protocol|0.12|600000000
cargox|CXO|CargoX|0.35|1000000000
tokenlon|LON|Tokenlon|0.85|100000000
degen|DEGEN|Degen|0.012|10000000000
safepal|SFP|SafePal|0.65|500000000
ark|ARK|Ark|0.35|180000000
lcx|LCX|LCX|0.35|800000000
ethpow|ETHW|ETHPoW|2.80|80000000
tornado-cash|TORN|Tornado Cash|3.50|10000000
civic|CVC|Civic|0.12|1000000000
rujira|RUJI|Rujira|0.65|100000000
iost|IOST|Internet of Services Token|0.0055|22000000000
flux|FLUX|Flux|0.85|350000000
wrapped-nxm|WNXM|Wrapped NXM|55|3000000
celo|CELO|Celo|0.55|680000000
harmony|ONE|Harmony|0.012|14000000000
ocean-protocol|OCEAN|Ocean Protocol|0.55|600000000
sleepless-ai|AI|Sleepless AI Token|0.35|1000000000
blast|BLAST|Blast|0.085|20000000000
cartesi|CTSI|Cartesi|0.18|800000000
kyber-network-crystal|KNC|Kyber Network Crystal|0.65|200000000
iq|IQ|IQ|0.0065|18000000000
audius|AUDIO|Audius|0.18|1100000000
api3|API3|API3|1.80|70000000
moviebloc|MBL|MovieBloc|0.0035|20000000000
smooth-love-potion|SLP|Smooth Love Potion|0.0035|15000000000
mil-k|MLK|MiL.k|0.35|500000000
secret|SCRT|Secret|0.35|150000000
moonriver|MOVR|Moonriver|12|10000000
metis-token|METIS|Metis Token|35|5000000
dydx|DYDX|dYdX|0.85|700000000
energy-web-token|EWT|Energy Web Token|1.80|50000000
liquity|LQTY|Liquity|0.85|100000000
token-pocket|TPT|Token Pocket|0.012|3000000000
arcblock|ABT|Arcblock|2.80|100000000
biconomy|BICO|Biconomy|0.35|500000000
echelon-prime|PRIME|Echelon Prime|8.50|50000000
spell-token|SPELL|Spell Token|0.00065|150000000000
cheelee|CHEEL|CHEELEE|8.50|30000000
cobak-token|CBK|Cobak Token|0.85|200000000
keep-network|KEEP|Keep Network|0.12|1000000000
shentu|CTK|Shentu|0.85|100000000
metal|MTL|Metal|1.80|50000000
wormhole|W|Wormhole|0.28|3000000000
ergo|ERG|Ergo|1.20|50000000
aevo|AEVO|Aevo|0.65|500000000
symbol|XYM|Symbol|0.018|7000000000
songbird|SGB|Songbird|0.012|15000000000
adventure-gold|AGLD|Adventure Gold|1.20|50000000
luna|LUNA|Luna|0.55|500000000
loopring|LRC|Loopring|0.18|1400000000
susd|SUSD|sUSD|1.00|10000000
quarkchain|QKC|QuarkChain|0.012|5000000000
wax|WAXP|WAX|0.055|3600000000
celer-network|CELR|Celer Network|0.018|8000000000
bifrost|BFC|Bifrost|0.055|2000000000
aergo|AERGO|Aergo|0.12|450000000
treasure-dao|MAGIC|Treasure DAO|0.55|200000000
prometeus|PROM|Prometeus|8.50|10000000
usual|USUAL|USUAL|0.35|500000000
ronin|RON|Ronin|1.80|300000000
singularitynet|AGIX|SingularityNET|0.35|1300000000
steem|STEEM|Steem|0.18|500000000
winklink|WIN|WINkLink|0.000065|1000000000000
delysium|AGI|Delysium|0.18|2000000000
harrypotterobamasonic10inu|BITCOIN|HarryPotterObamaSonic10Inu|0.12|1000000000
joe|JOE|JOE|0.35|400000000
tensor|TNSR|Tensor|0.55|500000000
binaryx|BNX|BinaryX v1|0.65|500000000
pocket-network|POKT|Pocket Network|0.085|1000000000
dodo|DODO|DODO|0.18|500000000
banana-gun|BANANA|Banana Gun v2|8.50|50000000
moonbeam|GLMR|Moonbeam|0.18|700000000
nosana|NOS|Nosana|2.80|50000000
coti|COTI|COTI|0.085|1000000000
marlin|POND|Marlin|0.018|8000000000
lisk|LSK|Lisk|0.85|150000000
radix|XRD|Radix Native Token|0.035|10000000000
firmachain|FCT|FirmaChain|0.035|500000000
vethor-token|VTHO|VeThor Token|0.0035|60000000000
radworks|RAD|Radworks|1.80|40000000
researchcoin|RSC|ResearchCoin|0.65|250000000
firo|FIRO|Firo|1.20|15000000
superrare|RARE|SuperRare|0.12|500000000
alethea-ai|ALI|Alethea Artificial Liquid Intelligence Token|0.035|20000000000
goldfinch-protocol|GFI|Goldfinch Protocol|1.80|15000000
ampleforth|AMPL|Ampleforth|1.20|50000000
bone-shibaswap|BONE|Bone ShibaSwap|0.55|250000000
stader|SD|Stader|0.85|50000000
alchemix|ALCX|Alchemix|18|2000000
magic-eden|ME|Magic Eden|3.50|100000000
corgiai|CORGIAI|CorgiAI|0.0012|500000000000
hivemapper|HONEY|Hivemapper|0.065|3000000000
wancoin|WAN|Wancoin|0.28|200000000
the-doge-nft|DOG|The Doge NFT|0.0085|100000000000
polyswarm|NCT|PolySwarm|0.018|2000000000
dextools|DEXT|DEXTools|0.55|100000000
hopr|HOPR|HOPR|0.085|500000000
thundercore|TT|ThunderCore|0.0035|10000000000
benqi|QI|BENQi|0.018|5000000000
medibloc|MED|Medibloc|0.012|5000000000
sweat-economy|SWEAT|Sweat Economy|0.012|10000000000
alltoscan|ATS|Alltoscan|0.085|100000000
dao-maker|DAO|DAO Maker|0.35|200000000
marblex|MBX|Marblex|0.55|100000000
marinade|MNDE|Marinade Token|0.18|200000000
bella-protocol|BEL|Bella Protocol|0.85|50000000
forta|FORT|Forta|0.18|300000000
hive|HIVE|Hive|0.28|500000000
inverse-finance|INV|Inverse Finance|28|150000
saffron-finance|SFI|Saffron Finance|65|80000
chromia|CHR|Chromia|0.18|500000000
gemini-dollar|GUSD|Gemini Dollar|1.00|100000000
adex|ADX|AdEx|0.18|150000000
orchid|OXT|Orchid|0.085|900000000
evernode|EVR|Evernode|0.065|100000000
yield-guild-games|YGG|Yield Guild Games|0.35|400000000
stader-liquid-staking-matic|MATICX|Stader Liquid Staking Matic|0.55|100000000
balancer|BAL|Balancer|2.80|50000000
wazirx|WRX|WazirX|0.18|400000000
band-protocol|BAND|Band Protocol|1.20|100000000
kleros|PNK|Kleros|0.035|5000000000
stasis-eurs|EURS|STASIS EURS|1.08|50000000
badger-dao|BADGER|Badger DAO|3.50|20000000
platon|LAT|PlatON|0.012|5000000000
access-protocol|ACS|Access Protocol|0.0028|100000000000
stake-dao|SDT|Stake DAO|0.35|100000000
omg-foundation|OMG|OMG Foundation|0.35|140000000
augur-v2|REPV2|Augur v2|0.85|11000000
bitgert|BRISE|Bitgert|0.00000035|1000000000000000
milady-cult-coin|CULT|Milady Cult Coin|0.000002|50000000000000
spacechain|SPC|SpaceChain|0.035|500000000
funtoken|FUN|FUNToken|0.0035|10000000000
oraichain|ORAI|Oraichain|8.50|15000000
nimiq|NIM|Nimiq|0.0012|10000000000
paal-ai|PAAL|PAAL AI v2|0.18|500000000
landwolf|WOLF|Landwolf|0.018|10000000000
green-satoshi-token|GST|Green Satoshi Token|0.018|5000000000
andy|ANDY|Andy|0.012|10000000000
elastos|ELA|Elastos|1.80|20000000
pond0x|PNDC|Pond0x|0.00012|500000000000
tars-ai|TAI|TARS AI|0.28|500000000
decentralized-usd|USDD|Decentralized USD|1.00|300000000
monacoin|MONA|MonaCoin|0.35|65000000
pivx|PIVX|PIVX|0.35|80000000
enzyme|MLN|Enzyme|18|3000000
polkastarter|POLS|Polkastarter|0.35|100000000
avail|AVAIL|Avail|0.12|1000000000
pangolin|PNG|Pangolin|0.085|300000000
bugscoin|BGSC|BugsCoin|0.0035|5000000000
bitcoin-limited-edition|BTCLE|Bitcoin Limited Edition|0.035|1000000000
district0x|DNT|district0x|0.055|1000000000
stepn|GMT|STEPN|0.12|6000000000
mcdex|MCB|MCDex|8.50|3000000
math|MATH|MATH|0.28|200000000
pointpay-token|PXP|PointPay Token|0.065|200000000
everscale|EVER|Everscale|0.035|2000000000
tokocrypto|TKO|Tokocrypto|0.35|500000000
autonolas|OLAS|Autonolas|1.80|60000000
contentos|COS|Contentos|0.035|1000000000
bitdao|BIT|BITDAO|0.35|300000000
mantra|OM|MANTRA|3.50|500000000
gamercoin|GHX|GamerCoin|0.085|500000000
unibright|UBT|Unibright|0.085|200000000
nakamoto-games|NAKA|Nakamoto Games|0.85|100000000
aventus|AVT|Aventus|1.80|5000000
renbtc|RENBTC|renBTC|65000|500
wen|WEN|Wen|0.065|5000000000
'@

$stablecoins = @("USDT","USDC","DAI","PYUSD","FDUSD","TUSD","USDP","BUSD","CUSD","SUSD","GUSD","EURS","USDD","FRAX")

$lines = $rawData.Trim() -split "`n"
$sb = New-Object System.Text.StringBuilder
$sb.AppendLine("const FALLBACK_COINS = [") | Out-Null
$rng = [Random]::new()
$idx = 0
foreach ($line in $lines) {
    $idx++
    $parts = $line -split '\|'
    $id = $parts[0]; $sym = $parts[1]; $name = $parts[2]; $price = [double]$parts[3]; $supply = [double]$parts[4]
    
    if ($parts.Count -ge 10) {
        $cap = [double]$parts[5]; $vol = [double]$parts[6]; $ch24 = [double]$parts[7]; $ch1 = [double]$parts[8]; $ch7 = [double]$parts[9]
    } else {
        $cap = $price * $supply
        if ($stablecoins -contains $sym) {
            $volPct = $rng.Next(3, 15) / 100.0
        } elseif ($sym -in @("PAXG","RENBTC","RBTC")) {
            $volPct = $rng.Next(1, 4) / 100.0
        } else {
            $volPct = $rng.Next(1, 6) / 100.0
        }
        $vol = [math]::Round($cap * $volPct)
        $ch24 = [math]::Round(($rng.NextDouble() * 10 - 5), 2)
        $ch1 = [math]::Round(($rng.NextDouble() * 4 - 2), 2)
        $ch7 = [math]::Round(($rng.NextDouble() * 20 - 10), 2)
    }
    
    $capRounded = [math]::Round($cap)
    $volRounded = [math]::Round($vol)
    $sb.AppendLine("  { id: `"$id`", symbol: `"$sym`", name: `"$name`", price: $price, cap: $capRounded, vol: $volRounded, change24h: $ch24, change1h: $ch1, change7d: $ch7, supply: $supply },") | Out-Null
}
$sb.AppendLine("];") | Out-Null

# Write to file
$sb.ToString() | Set-Content -Path "C:\OpenShelf-Tools\ai-crypto-monitor\fallback-coins.ts"
Write-Host "Generated file with $idx entries"
