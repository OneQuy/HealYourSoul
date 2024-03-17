import { Category, LocalText, StorageKey_RandomMeme1_CurrentIdx } from '../../constants/AppConstants';
import { TheRandomImage_PopupSelect } from '../template/TheRandomImage_PopupSelect';
import { useCallback } from 'react';
import { PopupSelectItem } from '../components/PopupSelect';
import { RandomImage } from '../../constants/Types';
import { GetIWasteSoMuchTimeAsync } from '../../handle/services/IWasteSoMuchTime';
import { GetRedditMemeAsync } from '../../handle/services/RedditMemeApi';

const Sources = [
    LocalText.random_meme_1_source_1,
    LocalText.random_meme_1_source_2,
]

export const RandomMemeScreen = () => {
    const getImage = useCallback(async (item: PopupSelectItem): Promise<RandomImage | undefined> => {
        if (item.displayText === LocalText.random_meme_1_source_1)
            return await GetIWasteSoMuchTimeAsync()
        else
            return await GetRedditMemeAsync()
    }, [])

    return (
        <TheRandomImage_PopupSelect
            fileURL=''
            configFileName=''
            category={Category.RandomMeme}
            currentItemIdxStorageKey={StorageKey_RandomMeme1_CurrentIdx}
            popupSelectTitle={LocalText.select_source}

            getImageWithParamAsync={getImage}

            fixedArrayData={Sources}
        />
    )
}