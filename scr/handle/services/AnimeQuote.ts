import AsyncStorage from "@react-native-async-storage/async-storage"
import { DelayAsync } from "../Utils"
import { StorageKey_AnimeQuote_RandomAll } from "../../constants/AppConstants"
import { GetApiDataItemFromCached } from "../AppUtils"
import { Quote } from "../../constants/Types"

const url = 'https://animechan.xyz/api/quotes'

export const GetAnimeQuoteListAsync_FromApi = async (): Promise<Quote[] | undefined> => {
    let res: Response | undefined

    for (let i = 0; i < 5; i++) {
        res = undefined

        try {
            res = await fetch(url)
        }
        catch { }

        if (res && res.ok) {
            break
        }
        else
            await DelayAsync(500)
    }

    if (!res || !res.ok) {
        return undefined
    }

    const arr = await res.json() as object[]

    if (!Array.isArray(arr) || arr.length <= 0)
        return undefined

    return arr.map(i => ({
        // @ts-ignore
        content: `${i.content}\n\n-${i.character} (${i.anime})`,
        // @ts-ignore
        author: i.author
    } as Quote))
}

export const GetQuoteTextAsync = async (): Promise<string | undefined> => {
    try {

        let json = await GetApiDataItemFromCached<Quote>(StorageKey_AnimeQuote_RandomAll)

        if (json !== undefined) {
            return '\"' + json.content + '"\n\n- ' + json.author
        }

        const forSavedArr = await GetAnimeQuoteListAsync_FromApi()

        if (forSavedArr === undefined)
            return undefined

        await AsyncStorage.setItem(StorageKey_AnimeQuote_RandomAll, JSON.stringify(forSavedArr))

        json = await GetApiDataItemFromCached<Quote>(StorageKey_AnimeQuote_RandomAll)

        if (json === undefined)
            return undefined

        const data = '\"' + json.content + '"\n\n- ' + json.author

        return data
    } catch (error) {
        console.error(error);
        return undefined
    }
}