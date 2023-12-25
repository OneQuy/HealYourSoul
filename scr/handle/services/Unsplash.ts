// https://unsplash.com/documentation#get-a-random-photo

import { UNSPLASH_KEY } from '../../../keys'

// export const GetRandomUnsplashPictureAsync = async (): Promise<string | undefined> => {
//     try {
//         const data = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}`)
        
//         if (data.status !== 200)
//             return undefined

//         const dataJ = await data.json();
    
//         return dataJ.urls.regular
//     } catch (error) {
//         return undefined
//     }
// }


export const GetRandomUnsplashPictureAsync = async (): Promise<string | undefined> => {
    try {
        const w = 1000 + Math.ceil(Math.random() * 500)
        const h = 1000 + Math.ceil(Math.random() * 500)

        const data = await fetch(`https://picsum.photos/${w}/${h}`)
        
        // console.log(data);
        
        if (data.status !== 200)
            return undefined

        return data.url
    } catch (error) {
        return undefined
    }
}