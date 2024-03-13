import { Category, StorageKey_DogFact_CurrentFactIdx } from "../../constants/AppConstants";
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