import { useCallback } from 'react';
import { Category, StorageKey_AnimeImage_CurrentIdx } from '../../constants/AppConstants';
import { TheRandomImage_PopupSelect } from '../template/TheRandomImage_PopupSelect';
import { PopupSelectItem } from '../components/PopupSelect';
import { RandomImage } from '../../constants/Types';

export const AnimeImageScreen = () => {
    const getImage = useCallback(async (item: PopupSelectItem): Promise<RandomImage | undefined> => {
        const url = `https://api.waifu.pics/many/sfw/${item.displayText}`

        try {
            const res = await fetch(url)

            if (!res.ok)
                return undefined

            const json = await res.json()
console.log(json);

            return {
                uri: json.files[0]
            } as RandomImage
        }
        catch {
            return undefined
        }
    }, [])

    return (
        <TheRandomImage_PopupSelect
            fileURL='https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fanime_image_subcatgories.json?alt=media&token=3d04ff71-5188-45c3-9935-3a47284dca54'
            configFileName='anime_image_subcatgories'
            category={Category.AnimeImage}
            currentItemIdxStorageKey={StorageKey_AnimeImage_CurrentIdx}
            getImageWithParamAsync={getImage}
        />
    )
}