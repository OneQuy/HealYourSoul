import axios from 'axios'
import { NINJA_JOKE_KEY } from '../../../keys';
import { GetApiDataItemFromCached } from '../AppUtils';
import { StorageKey_NinjaJoke } from '../../constants/AppConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options = {
    method: 'GET',
    url: 'https://dad-jokes-by-api-ninjas.p.rapidapi.com/v1/dadjokes',
    params: { limit: '30' },
    headers: {
        'X-RapidAPI-Key': NINJA_JOKE_KEY,
        'X-RapidAPI-Host': 'dad-jokes-by-api-ninjas.p.rapidapi.com'
    }
};

export const GetNinjaJokeAsync = async (): Promise<string | undefined> => {
    try {
        const cachedText = await GetApiDataItemFromCached<string>(StorageKey_NinjaJoke)

        if (cachedText !== undefined)
            return cachedText

        const response = await axios.request(options);

        if (response.status !== 200)
            return undefined

        if (!Array.isArray(response.data) || response.data.length <= 0)
            return undefined

        const textArr = response.data.map(i => i.joke as string)

        await AsyncStorage.setItem(StorageKey_NinjaJoke, JSON.stringify(textArr))

        return await GetApiDataItemFromCached<string>(StorageKey_NinjaJoke)
    } catch (error) {
        return undefined
    }
}