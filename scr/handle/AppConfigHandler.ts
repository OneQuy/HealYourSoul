import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { HandleError, ToastTheme } from "./AppUtils";
import { ThemeColor, } from "../constants/Colors";
import { IsInternetAvailableAsync, SetNetLordFetchUrl } from "./NetLord";
import { AppConfig } from "../constants/Types";
import { toast } from "@baronha/ting";
import { LocalText } from "../constants/AppConstants";

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

export async function HandleAppConfigAsync(theme: ThemeColor) {
    const isInternet = await IsInternetAvailableAsync()

    if (!isInternet) {
        toast({
            title: LocalText.offline_mode,
            ...ToastTheme(theme, 'none')
        })

        return
    }

    const result = await FirebaseDatabase_GetValueAsync(FirebaseDBPath)

    // fail

    if (result.error) {
        HandleError('HandleAppConfig', result.error, theme)
        return
    }

    // success

    appConfig = result.value as AppConfig

    // handle others

    if (appConfig.net_url)
        SetNetLordFetchUrl(appConfig.net_url)
}