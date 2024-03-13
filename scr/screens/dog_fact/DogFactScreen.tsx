import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetRemoteFileConfigVersion } from "../../handle/AppConfigHandler";
import { TempDirName } from "../../handle/Utils";
import useCheckAndDownloadRemoteFile from "../../hooks/useCheckAndDownloadRemoteFile";
import { Category, LocalText, NeedReloadReason, StorageKey_DogFact_CurrentFactIdx, StorageKey_LocalFileVersion } from "../../constants/AppConstants";
import TheRandomShortText from "../template/TheRandomShortText";
import { useCallback, useEffect } from "react";
import { GoodayToast } from "../../handle/AppUtils";
import { GetNumberIntAsync, SetNumberAsync } from "../../handle/AsyncStorageUtils";
import LoadingOrError from "../components/LoadingOrError";
import { NetLord } from "../../handle/NetLord";

const category = Category.DogFact

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffact_dogs.json?alt=media&token=4aac62bc-f24a-4be2-9240-ce435d631ecc'

export const DogFactScreen = () => {
    const { result: facts, didDownload, error, reUpdateAsync } = useCheckAndDownloadRemoteFile<string[]>(
        fileURL,
        TempDirName + '/fact_dogs.json',
        true,
        GetRemoteFileConfigVersion('fact_dogs'),
        'json',
        true,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fact_dogs').toString()))

    const getTextAsync = useCallback(async (): Promise<string | undefined> => {
        if (Array.isArray(facts)) {
            let curIdx = await GetNumberIntAsync(StorageKey_DogFact_CurrentFactIdx, -1) + 1

            if (curIdx >= facts.length)
                curIdx = 0

            SetNumberAsync(StorageKey_DogFact_CurrentFactIdx, curIdx)
            return facts[curIdx]
        }
        else
            return undefined
    }, [facts])

    // toast latest data

    useEffect(() => {
        if (!didDownload)
            return

        GoodayToast(LocalText.new_item_top_movies)
    }, [didDownload])

    if (!Array.isArray(facts)) {
        return (
            <LoadingOrError
                reasonToReload={error ? (NetLord.IsAvailableLatestCheck() ? NeedReloadReason.FailToGetContent : NeedReloadReason.NoInternet) : NeedReloadReason.None}
                onPressedReload={reUpdateAsync}
            />
        )
    }

    return <TheRandomShortText
        category={Category.DogFact}
        getTextAsync={getTextAsync}
    />;
}  