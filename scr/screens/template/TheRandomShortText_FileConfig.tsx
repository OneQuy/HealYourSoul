import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetRemoteFileConfigVersion } from "../../handle/AppConfigHandler";
import { TempDirName } from "../../handle/Utils";
import useCheckAndDownloadRemoteFile from "../../hooks/useCheckAndDownloadRemoteFile";
import { Category, LocalText, NeedReloadReason, StorageKey_LocalFileVersion } from "../../constants/AppConstants";
import TheRandomShortText from "../template/TheRandomShortText";
import { useCallback, useEffect } from "react";
import { GoodayToast } from "../../handle/AppUtils";
import { GetNumberIntAsync, SetNumberAsync } from "../../handle/AsyncStorageUtils";
import LoadingOrError from "../components/LoadingOrError";
import { NetLord } from "../../handle/NetLord";

/**
 * 
 * file config is a json string array.
 */
export const TheRandomShortText_FileConfig = ({
    fileURL,
    configFileName,
    category,
    currentItemStorageKey,
}: {
    category: Category,
    fileURL: string,
    configFileName: string,
    currentItemStorageKey: string,
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

    const getTextAsync = useCallback(async (): Promise<string | undefined> => {
        if (Array.isArray(textArr)) {
            let curIdx = await GetNumberIntAsync(currentItemStorageKey, -1) + 1

            if (curIdx >= textArr.length)
                curIdx = 0

            SetNumberAsync(currentItemStorageKey, curIdx)
            return textArr[curIdx]
        }
        else
            return undefined
    }, [textArr])

    // toast latest data

    useEffect(() => {
        if (!didDownload)
            return

        GoodayToast(LocalText.new_item_top_movies)
    }, [didDownload])

    if (!Array.isArray(textArr)) {
        return (
            <LoadingOrError
                reasonToReload={error ? (NetLord.IsAvailableLatestCheck() ? NeedReloadReason.FailToGetContent : NeedReloadReason.NoInternet) : NeedReloadReason.None}
                onPressedReload={reUpdateAsync}
            />
        )
    }

    return <TheRandomShortText
        category={category}
        getTextAsync={getTextAsync}
    />
}  