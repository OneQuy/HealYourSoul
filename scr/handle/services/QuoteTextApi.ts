import { DelayAsync } from "../Utils"

const url = 'https://api.quotable.io/random'

export const GetQuoteTextAsync = async (): Promise<string | undefined> => {
    try {
        
        let res: Response | undefined

        for (let i = 0; i < 5; i++) {
            res = await fetch(url)

            if (res.status === 200) {
                break
            }
            else
                await DelayAsync(500)
        }

        if (!res || !res.ok) {
            return undefined
        }

        const json = await res.json()
        const data = '\"' + json.content + '"\n\n- ' + json.author

        return data
    } catch (error) {
        console.error(error);
        return undefined
    }
}