import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { HandleError } from "./AppUtils";
import { ThemeColor, } from "../constants/Colors";
import { SetNetLordFetchUrl } from "./NetLord";
import { AppConfig } from "../constants/Types";
import { SetDateAsync_Now } from "./AsyncStorageUtils";
import { StorageKey_LastTimeCheckAndReloadAppConfig } from "../constants/AppConstants";

const FirebaseDBPath = 'app/config';

var appConfig: AppConfig | undefined

export const GetAppConfig = () => appConfig

/**
 * 
 * @returns version or NaN if fail to get config
 */
export function GetRemoteFileConfigVersion(file: string) {
    if (!appConfig)
        return Number.NaN

    // @ts-ignore
    const version = appConfig.remote_files[file]

    if (typeof version === 'number')
        return version as number
    else
        return Number.NaN
}

export async function HandleAppConfigAsync(): Promise<boolean> {
    const result = await FirebaseDatabase_GetValueAsync(FirebaseDBPath)

    // fail

    if (result.error) {
        HandleError('HandleAppConfig', result.error)
        return false
    }

    // success

    SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)

    appConfig = result.value as AppConfig

    // handle others

    if (appConfig.net_url)
        SetNetLordFetchUrl(appConfig.net_url)

    return true
}