export const CHAIN = process.env.CHAIN
if (!CHAIN) {
    console.error('No CHAIN provided')
    process.exit(0)
}

export const ENDPOINTS = CHAIN === 'proton'
    ? ["https://proton.eoscafeblock.com", "https://proton.pink.gg", "https://proton.greymass.com", ]
    : ["https://testnet.protonchain.com", "https://test.proton.pink.gg"]

export const PRIVATE_KEYS = [process.env.PRIVATE_KEY]
if (!process.env.PRIVATE_KEY) {
    console.error('No PRIVATE_KEY provided in .env')
    process.exit(0)
}

export const ORACLE_CONTRACT = "oracles"
export const ORACLES = [
    { oracle_index: 0, baseCurrency: 'XPR', baseId: 'proton', quoteCurrency: 'BTC', quoteId: 'btc' }
]

export const BOTS_CONTRACT = "bot"
export const BOTS_ACCOUNTS: BotAccount[] = [
    { bot_index: 0, name: 'bot1', permission: 'active', parallel: Math.ceil(500 / 86400) * 80, timer: (86400 / 500) * 1000, ...ORACLES[0] },
    { bot_index: 1, name: 'bot2', permission: 'active', parallel: Math.ceil(5000 / 86400) * 80, timer: (86400 / 5000) * 1000, ...ORACLES[0] },
    { bot_index: 2, name: 'bot3', permission: 'active', parallel: Math.ceil(50000 / 86400) * 80, timer: (86400 / 50000) * 1000, ...ORACLES[0] },
    { bot_index: 3, name: 'bot4', permission: 'active', parallel: Math.ceil(500000 / 86400) * 80, timer: (86400 / 500000) * 1000 , ...ORACLES[0] }
]
export const PRICE_FETCH_TIMER = 5000