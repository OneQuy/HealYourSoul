import { DelayAsync } from "../Utils"

const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary'

export const GetWikiAsync = async (): Promise<object | undefined> => {
    try {

        let res: Response | undefined

        for (let i = 0; i < 5; i++) {
            res = await fetch(url)

            if (res.ok) {
                break
            }
            else
                await DelayAsync(100)
        }

        if (!res || !res.ok) {
            return undefined
        }

        const json = await res.json()
        return extractDataFromRawObject(json)
    } catch (error) {
        console.error(error);
        return undefined
    }
}


const extractDataFromRawObject = (data: object | undefined) => {
    if (data === undefined)
        return undefined

    return {
        // @ts-ignore
        extract: data.extract,
        // @ts-ignore
        title: data.title,

        thumbnail: {
            // @ts-ignore
            source: data.thumbnail?.source
        },

        content_urls: {
            mobile: {
                // @ts-ignore
                page: data.content_urls?.mobile?.page
            },
            desktop: {
                // @ts-ignore
                page: data.content_urls?.desktop?.page
            }
        }
    }
}