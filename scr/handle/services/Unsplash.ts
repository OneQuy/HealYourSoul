// https://unsplash.com/documentation#get-a-random-photo

import { Dimensions } from "react-native"

// import { UNSPLASH_KEY } from '../../../keys'

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

const screen = Dimensions.get('screen')

export const GetRandomUnsplashPictureAsync = async (): Promise<string | undefined> => {
    try {
        const isLandscape = Math.random() > 0.5

        let w, h = 0

        const ratio = 1 + Math.random() * (18 / 9 - 1)

        if (isLandscape) {
            w = screen.width * screen.scale
            h = w / ratio
        }
        else {
            h = screen.height * screen.scale
            w = h / ratio
        }

        h = Math.ceil(h)
        w = Math.ceil(w)

        const data = await fetch(`https://picsum.photos/${w}/${h}.jpg`)

        // console.log(data);

        if (data.status !== 200)
            return undefined

        return data.url
    } catch (error) {
        return undefined
    }
}