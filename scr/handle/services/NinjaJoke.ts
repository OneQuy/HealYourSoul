import axios from 'axios'
import { NINJA_FACT_KEY } from '../../../keys';

const options = {
    method: 'GET',
    url: 'https://dad-jokes-by-api-ninjas.p.rapidapi.com/v1/dadjokes',
    headers: {
        'X-RapidAPI-Key': NINJA_FACT_KEY ,
        'X-RapidAPI-Host': 'dad-jokes-by-api-ninjas.p.rapidapi.com'
    }
};

export const GetNinjaJokeAsync = async (): Promise<string | undefined> => {
    try {
        const response = await axios.request(options);
        // console.log(response.data);

        if (response.status !== 200)
            return undefined

        const txt = response.data[0].joke

        if (typeof txt === 'string')
            return txt
        else
            return undefined
    } catch (error) {
        return undefined
    }
}