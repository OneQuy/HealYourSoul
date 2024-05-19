import { Category, StorageKey_CatFact_CurrentFactIdx, StorageKey_DogFact_CurrentFactIdx, StorageKey_MovieQuote_CurrentIdx } from "../../constants/AppConstants";
import { GetStaticFileUrl } from "../../handle/AppConfigHandler";
import { TheRandomShortText_FileConfig } from "../template/TheRandomShortText_FileConfig";


export const DogFactScreen = () => {
    const file = GetStaticFileUrl('dogFact', 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffact_dogs.json?alt=media&token=4aac62bc-f24a-4be2-9240-ce435d631ecc')
    // console.log(file);

    return (
        <TheRandomShortText_FileConfig
            category={Category.DogFact}
            fileURL={file}
            configFileName="fact_dogs"
            currentItemStorageKey={StorageKey_DogFact_CurrentFactIdx}
            shuffleIfJsonIsArray={true}
        />
    )
}


export const CatFactScreen = () => {
    const file = GetStaticFileUrl('catFact', 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffact_cats.json?alt=media&token=8a07c170-2013-49f5-bb15-a01726c6c3cd')
    // console.log(file);

    return (
        <TheRandomShortText_FileConfig
            category={Category.CatFact}
            fileURL={file}
            configFileName="fact_cats"
            currentItemStorageKey={StorageKey_CatFact_CurrentFactIdx}
            shuffleIfJsonIsArray={true}
        />
    )
}


export const MovieQuoteScreen = () => {
    const file = GetStaticFileUrl('movieQuote', 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fmovie_quotes.json?alt=media&token=3aaf866c-2463-483f-8478-f73a18f84a42')
    // console.log(file);

    return (
        <TheRandomShortText_FileConfig
            category={Category.MovieQuote}
            fileURL={file}
            configFileName="movie_quotes"
            currentItemStorageKey={StorageKey_MovieQuote_CurrentIdx}
            shuffleIfJsonIsArray={true}
        />
    )
}