import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://facts-by-api-ninjas.p.rapidapi.com/v1/facts',
    headers: {
        'X-RapidAPI-Key': '693dd75456msh921c376e306158cp12c5dbjsn32ff82c9294a',
        'X-RapidAPI-Host': 'facts-by-api-ninjas.p.rapidapi.com'
    }
};

export const GetFactAsync = async () => {
    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}