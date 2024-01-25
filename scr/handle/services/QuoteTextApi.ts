import AsyncStorage from "@react-native-async-storage/async-storage"
import { DelayAsync } from "../Utils"
import { StorageKey_Quote } from "../../constants/AppConstants"
import { GetApiDataItemFromCached } from "../AppUtils"
import { Quote } from "../../constants/Types"

const url = 'https://api.quotable.io/quotes/random?limit=100'

export const GetQuoteListAsync_FromApi = async (): Promise<Quote[] | undefined> => {
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

    // @ts-ignore
    return arr.map(i => ({ content: i.content, author: i.author } as Quote))
}

export const GetQuoteTextAsync = async (): Promise<string | undefined> => {
    try {

        let json = await GetApiDataItemFromCached<Quote>(StorageKey_Quote)

        if (json !== undefined) {
            return '\"' + json.content + '"\n\n- ' + json.author
        }

        const forSavedArr = await GetQuoteListAsync_FromApi()

        if (forSavedArr === undefined)
            return undefined

        await AsyncStorage.setItem(StorageKey_Quote, JSON.stringify(forSavedArr))

        json = await GetApiDataItemFromCached<Quote>(StorageKey_Quote)

        if (json === undefined)
            return undefined

        const data = '\"' + json.content + '"\n\n- ' + json.author

        return data
    } catch (error) {
        console.error(error);
        return undefined
    }
}