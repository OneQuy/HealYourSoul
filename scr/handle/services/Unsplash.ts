// https://unsplash.com/documentation#get-a-random-photo

import { UNSPLASH_KEY } from '../../../keys'

export const GetRandomUnsplashPictureAsync = async (): Promise<string | undefined> => {
    try {
        const data = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}`)
        // console.log(data.headers);
        
        if (data.status !== 200)
            return undefined

        const dataJ = await data.json();
    
        return dataJ.urls.regular
    } catch (error) {
        return undefined
    }
}