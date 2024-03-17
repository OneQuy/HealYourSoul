import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_Reddit } from "../../constants/AppConstants"
import { RandomImage } from "../../constants/Types"
import { GetApiDataItemFromCached } from "../AppUtils"

const url = 'https://meme-api.com/gimme/500'

export const GetRedditMemeAsync = async (): Promise<RandomImage | undefined> => {
    try {
        let data = await GetApiDataItemFromCached<RandomImage>(StorageKey_Reddit)

        console.log('get local ', data);

        if (data !== undefined) {
            return data
        }

        const response = await fetch(url)

        if (!response.ok)
            // return new Error(response.statusText)
            return undefined

        let json = await response.json()

        let arr: RandomImage[] = json.memes.map(i=> {
            return {
                uri: i.url,
                title: i.title,
            } as RandomImage
        })

        arr = arr.filter(i => {
            return i.uri.endsWith('gif') ||
                i.uri.endsWith('png') ||
                i.uri.endsWith('jpg') ||
                i.uri.endsWith('jpeg') ||
                i.uri.endsWith('webp')
        })

        if (arr.length === 0)
            // return new Error('[RandomMeme 2] can not fetch, empty arr')
            return undefined

        console.log('fetched', arr.length, url);

        await AsyncStorage.setItem(StorageKey_Reddit, JSON.stringify(arr))

        json = await GetApiDataItemFromCached<RandomImage>(StorageKey_Reddit)

        if (!json)
            // return new Error('[RandomMeme 2] get cached local fail')
            return undefined

        return json
    } catch (error) {
        return undefined
    }
}