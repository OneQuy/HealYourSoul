import AsyncStorage from "@react-native-async-storage/async-storage"
import { RandomImage } from "../../constants/Types"
import { RandomInt } from "../Utils"
import { StorageKey_WasteTimeItems } from "../../constants/AppConstants"

const url = 'https://www.iwastesomuchtime.com/random?pg='

const titleFind = '<h1 class="blog-post-title"><a href="https://www.iwastesomuchtime.com'
const imgFind = '<img src="https://www.iwastesomuchtime.com/wp-content/uploads/sites/'

const getItemFromCached = async (): Promise<RandomImage | undefined> => {
    const cachedItemArr = await AsyncStorage.getItem(StorageKey_WasteTimeItems)

    if (!cachedItemArr)
        return undefined

    const arr = JSON.parse(cachedItemArr) as RandomImage[]

    if (!arr || arr.length <= 0)
        return undefined

    const item = arr[0]

    const subArr = arr.slice(1)
    await AsyncStorage.setItem(StorageKey_WasteTimeItems, JSON.stringify(subArr))
    console.log('remian', subArr.length);

    return item
}

const extract = (text: string) : RandomImage[] => {
    const arr: RandomImage[] = []

    while (text && text.length > 0) {
        const idxTitle = text.indexOf(titleFind)

        if (idxTitle < 0)
            break

        text = text.substring(idxTitle + titleFind.length)

        let idx = text.indexOf('>')

        if (idx < 0)
            break

        let title = ''

        for (let i = idx + 1; i < text.length; i++) {
            if (text[i] === '<') {
                text = text.substring(i)
                break
            }

            title += text[i]
        }

        // ==================

        const idxImgUrl = text.indexOf(imgFind)

        if (idxImgUrl < 0)
            break

        text = text.substring(idxImgUrl)

        idx = text.indexOf('"')

        if (idx < 0)
            break

        let uri = ''

        for (let i = idx + 1; i < text.length; i++) {
            if (text[i] === '"') {
                text = text.substring(i)
                break
            }

            uri += text[i]
        }

        if (title && uri) {
            arr.push({
                title, uri
            })
        }
    }

    // const t = JSON.stringify(arr, null, 1)
    // console.log(t);

    return arr
}

export const GetIWasteSoMuchTimeAsync = async (): Promise<RandomImage | undefined> => {
    try {
        const item = await getItemFromCached()

        if (item)
            return item

        const link = url + RandomInt(1, 1000)
        console.log('fetchhhhh', link);

        const response = await fetch(link)

        if (response.status !== 200)
            return undefined

        const t = await response.text()

        const arr = extract(t)

        await AsyncStorage.setItem(StorageKey_WasteTimeItems, JSON.stringify(arr))

        return await getItemFromCached()
    } catch (error) {
        return undefined
    }
}