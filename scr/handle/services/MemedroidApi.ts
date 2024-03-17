import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_Memedroid } from "../../constants/AppConstants"
import { RandomImage } from "../../constants/Types"
import { GetApiDataItemFromCached } from "../AppUtils"
import { RandomInt } from "../Utils"
import { CreateError, GetTextBetween } from "../UtilsTS"
import { PopupSelectItem } from "../../screens/components/PopupSelect"

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
        console.log(source);
        
        let json = await GetApiDataItemFromCached<RandomImage>(StorageKey_Memedroid)
        // console.log('get local', json);

        if (json !== undefined) {
            return json
        }

        const link = `https://www.memedroid.com/memes/random?page=${RandomInt(1, 100)}`
        // console.log('fetching...', link);

        const response = await fetch(link)

        if (!response.ok)
            // return new Error(response.statusText)
            return undefined

        const arr = extract(await response.text())

        if (arr.length === 0)
            // return new Error('[RandomMeme 2] can not fetch, empty arr')
            return undefined

        await AsyncStorage.setItem(StorageKey_Memedroid, JSON.stringify(arr))

        json = await GetApiDataItemFromCached<RandomImage>(StorageKey_Memedroid)

        if (!json)
            // return new Error('[RandomMeme 2] get cached local fail')
            return undefined

        return json
    } catch (error) {
        return undefined
    }
}