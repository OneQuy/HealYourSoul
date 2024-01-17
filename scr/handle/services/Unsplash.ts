// https://unsplash.com/documentation#get-a-random-photo

import { Dimensions } from "react-native"
import { ToCanPrint } from "../UtilsTS"
import { RandomImage } from "../../constants/Types"

// import { UNSPLASH_KEY } from '../../../keys'

// export const GetRandomUnsplashPictureAsync = async (): Promise<string | undefined> => {
//     try {
//         const data = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}`)

//         if (!data.ok)
//             return undefined

//         const dataJ = await data.json();

//         return dataJ.urls.regular
//     } catch (error) {
//         return undefined
//     }
// }

const screen = Dimensions.get('screen')
const minSize = 1000

export const GetRandomUnsplashPictureAsync = async (): Promise<RandomImage | undefined> => {
    try {
        const isLandscape = Math.random() > 0.5

        let w, h = 0

        const ratio = 1 + Math.random() * (18 / 9 - 1)

        if (isLandscape) {
            w = screen.width * screen.scale
            h = w / ratio

            if (h < minSize) {
                h = minSize
                w = h * ratio
            }
        }
        else {
            h = screen.height * screen.scale
            w = h / ratio

            if (w < minSize) {
                w = minSize
                h = w * ratio
            }
        }

        h = Math.ceil(h)
        w = Math.ceil(w)
        
        const data = await fetch(`https://picsum.photos/${w}/${h}.jpg`)

        // console.log(ToCanPrint(data))

        if (!data.ok)
            return undefined

        return { uri: data.url }
    } catch (error) {
        return undefined
    }
}