import AsyncStorage from "@react-native-async-storage/async-storage"
import { DelayAsync } from "../Utils"
import { StorageKey_DogFact} from "../../constants/AppConstants"
import { GetApiDataItemFromCached } from "../AppUtils"

const url = 'http://dog-api.kinduff.com/api/facts?number=50'

const GetDogFactListAsync_FromApi = async (): Promise<string[] | undefined> => {
    let res: Response | undefined

    for (let i = 0; i < 5; i++) {
        res = undefined

        try {
            res = await fetch(url)
        }
        catch (e){
            console.error(e)
         }

        if (res && res.ok) {
            break
        }
        else
            await DelayAsync(500)
    }

    if (!res || !res.ok) {
        console.log('err', res?.statusText);
        
        return undefined
    }
    
    const json = await res.json()
    console.log('json', json);

    if (!json || !Array.isArray(json.facts))
        return undefined

    const arr = json.facts as string[]

    if (arr.length <= 0)
        return undefined
console.log('aaa', arr.length);

    return arr
}

export const GetDogFactTextAsync = async (): Promise<string | undefined> => {
    try {

        let factText = await GetApiDataItemFromCached<string>(StorageKey_DogFact)
console.log('from local: ' + factText);

        if (factText !== undefined) {
            return factText
        }

        const forSavedArr = await GetDogFactListAsync_FromApi()

        if (forSavedArr === undefined)
            return undefined

        await AsyncStorage.setItem(StorageKey_DogFact, JSON.stringify(forSavedArr))

        factText = await GetApiDataItemFromCached<string>(StorageKey_DogFact)

        if (factText === undefined)
            return undefined

        return factText
    } catch (error) {
        console.error(error);
        return undefined
    }
}