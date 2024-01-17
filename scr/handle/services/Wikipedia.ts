import { DelayAsync } from "../Utils"

const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary'

export const GetWikiAsync = async (): Promise<object | undefined> => {
    try {
        
        let res: Response | undefined

        for (let i = 0; i < 5; i++) {
            res = await fetch(url)

            if (res.status === 200) {
                break
            }
            else
                await DelayAsync(100)
        }

        if (!res || !res.ok) {
            return undefined
        }

        const json = await res.json()
        return json
    } catch (error) {
        console.error(error);
        return undefined
    }
}