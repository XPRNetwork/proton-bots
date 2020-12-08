import { Api, JsonRpc, JsSignatureProvider } from '@protonprotocol/protonjs'
import fetch from 'node-fetch'
import { ENDPOINTS, PRIVATE_KEYS, BOTS_CONTRACT, BOTS_ACCOUNTS } from './constants'
import { wait, randomNumber } from './utils'
import { fetchPrices } from './price'

export const rpc = new JsonRpc(ENDPOINTS, { fetch: fetch })
export const api = new Api({ rpc, signatureProvider: new JsSignatureProvider(PRIVATE_KEYS as any) })

const process = async (account: BotAccount) => {
    const prices = await fetchPrices()
    if (prices[account.baseId] === undefined || prices[account.baseId][account.quoteId] === undefined) {
        console.error('Not configured for price: ', account)
    }
    const price = prices[account.baseId][account.quoteId]

    const actions = [
        {
            account: BOTS_CONTRACT,
            name: 'process',
            data: {
                account: account.name,
                entries: [
                    { bot_index: account.bot_index, data: ["float64", price] }
                ],
                nonce: randomNumber(1, 1000)
            },
            authorization: [ { actor: account.name, permission: account.permission } ]
        }
    ]

    try {
        const result = await api.transact({ actions }, { useLastIrreversible: true, expireSeconds: 400 })
        return result
    } catch (e) {
        console.log(e)
    }
}

const processor = async (account: BotAccount) => {
    const toProcess = Array(account.parallel).fill(0)
    await Promise.all(
        toProcess.map(() => process(account))
    )
    toProcess.forEach(() => console.count(account.name))

    await wait(account.timer)
    processor(account)
}

for (const account of BOTS_ACCOUNTS) {
    processor(account)
}