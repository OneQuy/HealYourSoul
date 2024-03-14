import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetRemoteFileConfigVersion } from "../../handle/AppConfigHandler";
import { TempDirName } from "../../handle/Utils";
import useCheckAndDownloadRemoteFile from "../../hooks/useCheckAndDownloadRemoteFile";
import { Category, LocalText, NeedReloadReason, StorageKey_LocalFileVersion } from "../../constants/AppConstants";
import { useEffect, useMemo } from "react";
import { GoodayToast } from "../../handle/AppUtils";
import LoadingOrError from "../components/LoadingOrError";
import { NetLord } from "../../handle/NetLord";
import TheRandomImage from "./TheRandomImage";
import { RandomImage } from "../../constants/Types";
import { PopupSelectItem } from "../components/PopupSelect";

/**
 * 
 * file config is a json contains string[] (displayTexts of popup select)
 */
export const TheRandomImage_PopupSelect = ({
    fileURL,
    configFileName,
    category,
    currentItemIdxStorageKey,
    getImageWithParamAsync,

    popupSelectTitle,
}: {
    category: Category,
    fileURL: string,
    configFileName: string,
    currentItemIdxStorageKey: string,
    getImageWithParamAsync: (item: PopupSelectItem) => Promise<RandomImage | undefined>,

    popupSelectTitle?: string,
}) => {
    const { result: textArr, didDownload, error, reUpdateAsync } = useCheckAndDownloadRemoteFile<string[]>(
        fileURL,
        TempDirName + `/${configFileName}.json`,
        true,
        GetRemoteFileConfigVersion(configFileName),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion(configFileName).toString()))

    const selectItems = useMemo(() => {
        if (!Array.isArray(textArr))
            return undefined
        else
            return textArr.map(i => ({
                displayText: i,
            } as PopupSelectItem))
    }, [textArr])

    // toast latest data

    useEffect(() => {
        if (!didDownload)
            return

        GoodayToast(LocalText.new_item_top_movies)
    }, [didDownload])

    if (!Array.isArray(textArr) || !selectItems) {
        return (
            <LoadingOrError
                reasonToReload={error ? (NetLord.IsAvailableLatestCheck() ? NeedReloadReason.FailToGetContent : NeedReloadReason.NoInternet) : NeedReloadReason.None}
                onPressedReload={reUpdateAsync}
            />
        )
    }

    return <TheRandomImage
        category={category}

        storageKeyCurrentItemIdxInPopupSelect={currentItemIdxStorageKey}
        selectItems={selectItems}
        getImageWithParamAsync={getImageWithParamAsync}
        popupSelectTitle={popupSelectTitle}
    />;
}  