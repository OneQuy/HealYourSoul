import axios from 'axios';
import { NINJA_FACT_KEY, NINJA_FACT_KEY_2, NINJA_FACT_KEY_3 } from '../../../keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey_NinjaFact, StorageKey_NinjaFact_NextApiKey } from '../../constants/AppConstants';
import { GetApiDataItemFromCached } from '../AppUtils';
import { GetNextApiKeyAsync } from '../AsyncStorageUtils';

const GetOptionsAsync = async (increase?: boolean) => {
    const apiKey = await GetNextApiKeyAsync(
        StorageKey_NinjaFact_NextApiKey,
        [
            NINJA_FACT_KEY,
            NINJA_FACT_KEY_2,
            NINJA_FACT_KEY_3,
        ],
        increase
    )

    console.log('GetNinjaFactAsync-GetOptionsAsync', apiKey);

    return {
        method: 'GET',
        url: 'https://facts-by-api-ninjas.p.rapidapi.com/v1/facts',
        // params: { limit: '30' },
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'facts-by-api-ninjas.p.rapidapi.com'
        }
    }
}

export const GetNinjaFactAsync = async (): Promise<string | undefined> => {
    try {
        const cachedText = await GetApiDataItemFromCached<string>(StorageKey_NinjaFact)

        if (cachedText !== undefined)
            return cachedText

        const textArr = await GetFactListAsync_FromApi()

        if (!textArr)
            return undefined

        await AsyncStorage.setItem(StorageKey_NinjaFact, JSON.stringify(textArr))

        return await GetApiDataItemFromCached<string>(StorageKey_NinjaFact)
    } catch (error) {
        return undefined
    }
}

export const GetFactListAsync_FromApi = async (): Promise<string[] | undefined> => {
    try {
        const response = await axios.request(await GetOptionsAsync());

        if (response.status !== 200) {
            await GetOptionsAsync(true) // change api key
            return undefined
        }

        if (!Array.isArray(response.data) || response.data.length <= 0) {
            await GetOptionsAsync(true) // change api key
            return undefined
        }

        return response.data.map(i => i.fact as string)
    }
    catch {
        //  Request failed with status code 429 | ERR_BAD_REQUEST

        await GetOptionsAsync(true) // change api key

        return undefined
    }
}