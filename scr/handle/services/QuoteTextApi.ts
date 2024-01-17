import AsyncStorage from "@react-native-async-storage/async-storage"
import { DelayAsync } from "../Utils"
import { ToCanPrint } from "../UtilsTS"
import { StorageKey_Quote } from "../../constants/AppConstants"
import { GetApiDataItemFromCached } from "../AppUtils"

const url = 'https://api.quotable.io/quotes/random?limit=100'

export const GetQuoteTextAsync = async (): Promise<string | undefined> => {
    try {

        let json = await GetApiDataItemFromCached<object>(StorageKey_Quote)

        if (json !== undefined) {
            // @ts-ignore
            return '\"' + json.content + '"\n\n- ' + json.author
        }

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

        const arr = await res.json() as object[]

        if (!Array.isArray(arr) || arr.length <= 0)
            return undefined

        // @ts-ignore
        const forSavedArr = arr.map(i => ({ content: i.content, author: i.author }))

        await AsyncStorage.setItem(StorageKey_Quote, JSON.stringify(forSavedArr))

        json = await GetApiDataItemFromCached<object>(StorageKey_Quote)

        if (json === undefined)
            return undefined

        // @ts-ignore
        const data = '\"' + json.content + '"\n\n- ' + json.author

        return data
    } catch (error) {
        console.error(error);
        return undefined
    }
}