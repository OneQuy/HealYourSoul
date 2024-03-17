import AsyncStorage from "@react-native-async-storage/async-storage"
import { LocalText, StorageKey_Memedroid, StorageKey_Memedroid_CurrentPage } from "../../constants/AppConstants"
import { RandomImage } from "../../constants/Types"
import { GetApiDataItemFromCached } from "../AppUtils"
import { RandomInt } from "../Utils"
import { FilterOnlyLetterAndNumberFromString, GetTextBetween } from "../UtilsTS"
import { PopupSelectItem } from "../../screens/components/PopupSelect"
import { LoopNumberAsync } from "../AsyncStorageUtils"

const extract = (text: string): RandomImage[] => {
    const lines = text.split('\n')
    const arr: RandomImage[] = []

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        let idx = line.indexOf('<picture>')

        if (idx < 0)
            continue

        idx = line.indexOf('srcset=')

        if (idx < 0)
            continue

        let s = line.substring(idx)

        const uri = GetTextBetween(s, '"')

        if (!uri)
            continue

        idx = line.indexOf('alt=')
        let title

        if (idx >= 0) {
            s = line.substring(idx)
            title = GetTextBetween(s, '"')

            if (title) {
                title = title.replace(' - meme', '')
            }
        }

        arr.push({
            uri, title
        })
    }

    // console.log(JSON.stringify(arr, null, 1));

    return arr
}

export const GetMemedroidAsync = async (source: PopupSelectItem): Promise<RandomImage | undefined> => {
    try {
        const key = StorageKey_Memedroid(FilterOnlyLetterAndNumberFromString(source.displayText))
        let json = await GetApiDataItemFromCached<RandomImage>(key)

        // console.log('get local ', key, json);

        if (json !== undefined) {
            return json
        }

        let link
        const maxPage = 100
        const mediumPage = 10
        const fewPage = 3

        if (source.displayText === LocalText.memedroid_trending) {
            const curPage = await LoopNumberAsync(StorageKey_Memedroid_CurrentPage('trend'), 1, fewPage)
            link = `https://www.memedroid.com/memes/trending?page=${curPage}`
        }

        else if (source.displayText === LocalText.memedroid_day) {
            const curPage = await LoopNumberAsync(StorageKey_Memedroid_CurrentPage('day'), 1, fewPage)
            link = `https://www.memedroid.com/memes/top/day?page=${curPage}`
        }

        else if (source.displayText === LocalText.memedroid_week) {
            const curPage = await LoopNumberAsync(StorageKey_Memedroid_CurrentPage('week'), 1, mediumPage)
            link = `https://www.memedroid.com/memes/top/week?page=${curPage}`
        }

        else if (source.displayText === LocalText.memedroid_month) {
            const curPage = await LoopNumberAsync(StorageKey_Memedroid_CurrentPage('month'), 1, mediumPage)
            link = `https://www.memedroid.com/memes/top/month?page=${curPage}`
        }

        else if (source.displayText === LocalText.memedroid_ever)
            link = `https://www.memedroid.com/memes/top/ever?page=${RandomInt(1, maxPage)}`

        else // random all
            link = `https://www.memedroid.com/memes/random?page=${RandomInt(1, maxPage)}`

        console.log('fetching...', link);

        const response = await fetch(link)

        if (!response.ok)
            // return new Error(response.statusText)
            return undefined

        const arr = extract(await response.text())

        if (arr.length === 0)
            // return new Error('[RandomMeme 2] can not fetch, empty arr')
            return undefined

        await AsyncStorage.setItem(key, JSON.stringify(arr))

        json = await GetApiDataItemFromCached<RandomImage>(key)

        if (!json)
            // return new Error('[RandomMeme 2] get cached local fail')
            return undefined

        return json
    } catch (error) {
        return undefined
    }
}