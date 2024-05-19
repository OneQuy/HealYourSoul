import axios from 'axios'
import { NINJA_JOKE_KEY, NINJA_JOKE_KEY_2 } from '../../../keys';
import { GetApiDataItemFromCached } from '../AppUtils';
import { StorageKey_NinjaJoke, StorageKey_NinjaJoke_NextApiKey } from '../../constants/AppConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetNextApiKeyAsync } from '../AsyncStorageUtils';

const GetOptionsAsync = async () => {
    const apiKey = await GetNextApiKeyAsync(
        StorageKey_NinjaJoke_NextApiKey,
        [
            NINJA_JOKE_KEY,
            NINJA_JOKE_KEY_2,
        ]
    )

    console.log('GetNinjaJokeAsync', apiKey);

    return {
        method: 'GET',
        url: 'https://jokes-by-api-ninjas.p.rapidapi.com/v1/jokes',
        params: { limit: '30' },
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'jokes-by-api-ninjas.p.rapidapi.com'
        }
    };
}

export const GetNinjaJokeAsync = async (): Promise<string | undefined> => {
    try {
        const cachedText = await GetApiDataItemFromCached<string>(StorageKey_NinjaJoke)

        if (cachedText !== undefined)
            return cachedText

        const textArr = await GetJokeListAsync_FromApi()

        if (!textArr)
            return undefined

        await AsyncStorage.setItem(StorageKey_NinjaJoke, JSON.stringify(textArr))

        return await GetApiDataItemFromCached<string>(StorageKey_NinjaJoke)
    } catch (error) {
        return undefined
    }
}

export const GetJokeListAsync_FromApi = async (): Promise<string[] | undefined> => {
    try {
        const response = await axios.request(await GetOptionsAsync())

        // console.log(response);

        if (response.status !== 200)
            return undefined


        if (!Array.isArray(response.data) || response.data.length <= 0)
            return undefined

        console.log(response.data.length);

        return response.data.map(i => i.joke as string)
    }
    catch (e) {
        //  Request failed with status code 429 ERR_BAD_REQUEST

        // console.log('bbbb', e?.message, e?.code);

        return undefined
    }
}