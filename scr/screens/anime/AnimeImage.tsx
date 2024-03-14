import { useCallback } from 'react';
import { Category, StorageKey_AnimeImage_ByType, StorageKey_AnimeImage_CurrentIdx } from '../../constants/AppConstants';
import { TheRandomImage_PopupSelect } from '../template/TheRandomImage_PopupSelect';
import { PopupSelectItem } from '../components/PopupSelect';
import { RandomImage } from '../../constants/Types';
import { GetApiDataItemFromCached } from '../../handle/AppUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AnimeImageScreen = () => {
    const getImage = useCallback(async (item: PopupSelectItem): Promise<RandomImage | undefined> => {
        // try get local first

        let link = await GetApiDataItemFromCached<string>(StorageKey_AnimeImage_ByType(item.displayText))

        if (link !== undefined) {
            // console.log('caced', link);

            return {
                uri: link
            } as RandomImage
        }

        // fetch

        const url = `https://api.waifu.pics/many/sfw/${item.displayText}`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ exclude: null }),
            })

            if (!res.ok)
                return undefined

            const links = (await res.json()).files as string[]
            // console.log('fetched', links.length);

            await AsyncStorage.setItem(StorageKey_AnimeImage_ByType(item.displayText), JSON.stringify(links))

            link = await GetApiDataItemFromCached<string>(StorageKey_AnimeImage_ByType(item.displayText))
            // console.log('aa', link);

            if (link !== undefined) {
                return {
                    uri: link
                } as RandomImage
            }
            else
                return undefined
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