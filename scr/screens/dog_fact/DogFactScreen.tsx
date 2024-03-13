import { Category, StorageKey_CatFact_CurrentFactIdx, StorageKey_DogFact_CurrentFactIdx } from "../../constants/AppConstants";
import { TheRandomShortText_FileConfig } from "../template/TheRandomShortText_FileConfig";

export const DogFactScreen = () => {
    return (
        <TheRandomShortText_FileConfig
            category={Category.DogFact}
            fileURL='https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffact_dogs.json?alt=media&token=4aac62bc-f24a-4be2-9240-ce435d631ecc'
            configFileName="fact_dogs"
            currentItemStorageKey={StorageKey_DogFact_CurrentFactIdx}
        />
    )
}

export const CatFactScreen = () => {
    return (
        <TheRandomShortText_FileConfig
            category={Category.CatFact}
            fileURL='https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffact_cats.json?alt=media&token=8a07c170-2013-49f5-bb15-a01726c6c3cd'
            configFileName="fact_cats"
            currentItemStorageKey={StorageKey_CatFact_CurrentFactIdx}
        />
    )
}
