import axios from 'axios';
import { NINJA_FACT_KEY } from '../../../keys';

const options = {
    method: 'GET',
    url: 'https://facts-by-api-ninjas.p.rapidapi.com/v1/facts',
    params: {limit: '30'},
    headers: {
        'X-RapidAPI-Key': NINJA_FACT_KEY,
        'X-RapidAPI-Host': 'facts-by-api-ninjas.p.rapidapi.com'
    }
};

export const GetNinjaFactAsync = async () : Promise<string | undefined> => {
    try {
        const response = await axios.request(options);
        
        if (response.status !== 200)
            return undefined

        const txt = response.data[0].fact
        
        if (typeof txt === 'string')
            return txt
        else
            return undefined
    } catch (error) {
        return undefined
    }
}