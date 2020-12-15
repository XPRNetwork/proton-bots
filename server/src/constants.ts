export const CHAIN = process.env.CHAIN
if (!CHAIN) {
    console.error('No CHAIN provided')
    process.exit(0)
}

export const ENDPOINTS = CHAIN === 'proton'
    ? ["https://proton.eoscafeblock.com", "https://proton.eosusa.news", "https://proton.cryptolions.io", "https://proton.pink.gg", "https://proton.eoscafeblock.com"]
    : ["https://testnet.protonchain.com", "https://testnet.proton.pink.gg"]

export const PRIVATE_KEYS = [process.env.PRIVATE_KEY]
if (!process.env.PRIVATE_KEY) {
    console.error('No PRIVATE_KEY provided in .env')
    process.exit(0)
}

export const ORACLE_CONTRACT = "oracles"
export const ORACLES = [
    { oracle_index: 0, baseCurrency: 'XPR', baseId: 'proton', quoteCurrency: 'BTC', quoteId: 'btc' },
    { oracle_index: 1, baseCurrency: 'BTC', baseId: 'bitcoin', quoteCurrency: 'USD', quoteId: 'usd' }
]

export const BOTS_CONTRACT = "bot"
export const BOTS_ACCOUNTS: BotAccount[] = [
    { bot_index: 0, name: 'bot1', permission: 'active', parallel: 4, timer: (86400 / 500) * 1000, ...ORACLES[1] },
    { bot_index: 1, name: 'bot2', permission: 'active', parallel: 4, timer: (86400 / 5000) * 1000, ...ORACLES[1] },
    { bot_index: 2, name: 'bot3', permission: 'active', parallel: 20, timer: (86400 / 50000) * 1000, ...ORACLES[1] },
    { bot_index: 3, name: 'bot4', permission: 'active', parallel: 1000, timer: 1000, ...ORACLES[1] }
]
export const PRICE_FETCH_TIMER = 5000
export const ACTIONS_MULTIPLIER = 4