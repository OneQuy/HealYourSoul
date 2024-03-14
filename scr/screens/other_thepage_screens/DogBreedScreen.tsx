import { useCallback } from 'react';
import { Category, LocalText, StorageKey_DogBreed_CurrentBreedIdx } from '../../constants/AppConstants';
import { TheRandomImage_PopupSelect } from '../template/TheRandomImage_PopupSelect';
import { PopupSelectItem } from '../components/PopupSelect';
import { RandomImage } from '../../constants/Types';

export const DogBreedScreen = () => {
    const getImage = useCallback(async (item: PopupSelectItem): Promise<RandomImage | undefined> => {
        const url = `https://dog.ceo/api/breed/${item.displayText}/images/random`

        try {
            const res = await fetch(url)

            if (!res.ok)
                return undefined

            const json = await res.json()

            return {
                uri: json.message,
            } as RandomImage
        }
        catch {
            return undefined
        }
    }, [])

    return (
        <TheRandomImage_PopupSelect
            fileURL='https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fdog_breeds.json?alt=media&token=e96761dd-9923-4082-83b9-19a1ee249b8d'
            configFileName='dog_breeds'
            category={Category.DogBreed}
            currentItemIdxStorageKey={StorageKey_DogBreed_CurrentBreedIdx}
            getImageWithParamAsync={getImage}
            popupSelectTitle={LocalText.select_dog_breed}
        />
    )
}