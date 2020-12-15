import { Api, JsonRpc, JsSignatureProvider } from '@protonprotocol/protonjs'
import fetch from 'node-fetch'
import { ENDPOINTS, PRIVATE_KEYS, BOTS_CONTRACT, BOTS_ACCOUNTS, ACTIONS_MULTIPLIER } from './constants'
import { wait, randomNumber } from './utils'
import { fetchPrices } from './price'

const manager = ENDPOINTS.map((_) => {
    const rpc = new JsonRpc(ENDPOINTS, { fetch: fetch })
    const api = new Api({ rpc, signatureProvider: new JsSignatureProvider(PRIVATE_KEYS as any) })
    return {
        rpc,
        api
    }
})

const process = async (account: BotAccount, index: number = 1) => {
    const prices = await fetchPrices()
    if (prices[account.baseId] === undefined || prices[account.baseId][account.quoteId] === undefined) {
        console.error('Not configured for price: ', account)
    }
    const price = prices[account.baseId][account.quoteId]

    // @ts-ignore-next-line
    const actions = [...Array(ACTIONS_MULTIPLIER).keys()].map((i) => ({
        account: BOTS_CONTRACT,
        name: 'process',
        data: {
            account: account.name,
            entries: [
                {
                    bot_index: account.bot_index,
                    data: {
                        d_double: price,
                        d_string: null,
                        d_uint64_t: null
                    }
                }
            ],
            nonce: randomNumber(1, 200000),
            oracle_index: account.oracle_index
        },
        authorization: [ { actor: account.name, permission: account.permission } ]
    }))

    try {
        const result = await manager[index % manager.length].api.transact({ actions }, { useLastIrreversible: true, expireSeconds: 400 })
        return result
    } catch (e) {
        console.log(e)
    }
}

const processor = async (account: BotAccount) => {
    const toProcess = Array(account.parallel).fill(0)
    await Promise.all(
        toProcess.map((_, i) => process(account, i))
    )
    toProcess.forEach(() => console.count(account.name))

    await wait(account.timer)
    processor(account)
}

for (const account of BOTS_ACCOUNTS) {
    processor(account)
}