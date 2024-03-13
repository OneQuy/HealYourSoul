import { Category, StorageKey_DogBreed_CurrentBreedIdx } from '../../constants/AppConstants';
import { GetIWasteSoMuchTimeAsync } from '../../handle/services/IWasteSoMuchTime';
import TheRandomImage from '../template/TheRandomImage';

export const DogBreedScreen = () => {
    return <TheRandomImage
        category={Category.DogBreed}
        getImageAsync={GetIWasteSoMuchTimeAsync}

        storageKeyCurrentItemIdxInPopupSelect={StorageKey_DogBreed_CurrentBreedIdx}

        selectItems={[
            {
                displayText: 'a'
            },
            {
                displayText: 'b'
            }
        ]}
    />;
}
