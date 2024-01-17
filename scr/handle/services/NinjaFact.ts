import axios from 'axios';
import { NINJA_FACT_KEY } from '../../../keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey_NinjaFact } from '../../constants/AppConstants';
import { GetApiDataItemFromCached } from '../AppUtils';

const options = {
    method: 'GET',
    url: 'https://facts-by-api-ninjas.p.rapidapi.com/v1/facts',
    params: { limit: '30' },
    headers: {
        'X-RapidAPI-Key': NINJA_FACT_KEY,
        'X-RapidAPI-Host': 'facts-by-api-ninjas.p.rapidapi.com'
    }
};

export const GetNinjaFactAsync = async (): Promise<string | undefined> => {
    try {
        const cachedText = await GetApiDataItemFromCached<string>(StorageKey_NinjaFact)

        if (cachedText !== undefined)
            return cachedText

        const response = await axios.request(options);

        if (response.status !== 200)
            return undefined

        if (!Array.isArray(response.data) || response.data.length <= 0)
            return undefined

        const textArr = response.data.map(i => i.fact as string)

        await AsyncStorage.setItem(StorageKey_NinjaFact, JSON.stringify(textArr))

        return await GetApiDataItemFromCached<string>(StorageKey_NinjaFact)
    } catch (error) {
        return undefined
    }
}