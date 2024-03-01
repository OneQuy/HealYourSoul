import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { SetNetLordFetchUrl } from "./NetLord";
import { AppConfig } from "../constants/Types";
import { FirebaseDatabaseTimeOutMs } from "../constants/AppConstants";
import { ExecuteWithTimeoutAsync } from "./UtilsTS";

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

/**
 * if not get app config yet, re-fetch it.
 */
export async function DoubleCheckGetAppConfigAsync(): Promise<AppConfig | undefined> {
    if (GetAppConfig()) {
        return GetAppConfig()
    }

    await HandleAppConfigAsync()

    return GetAppConfig()
}

/**
 * 
 * @returns true if download success
 */
export async function HandleAppConfigAsync(): Promise<boolean> {
    // const tick = Date.now()

    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(FirebaseDBPath),
        FirebaseDatabaseTimeOutMs)

    // fail time out

    if (res.isTimeOut || res.result === undefined) {
        return false
    }

    const result = res.result

    // fail firebase

    if (result.error) {
        return false
    }

    // success

    appConfig = result.value as AppConfig

    // handle others

    if (appConfig.net_url)
        SetNetLordFetchUrl(appConfig.net_url)

    return true
}