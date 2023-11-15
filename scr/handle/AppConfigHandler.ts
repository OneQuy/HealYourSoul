import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { HandleError, ToastTheme } from "./AppUtils";
import { ThemeColor, } from "../constants/Colors";
import { IsInternetAvailableAsync } from "./NetLord";
import { AppConfig } from "../constants/Types";
import { toast } from "@baronha/ting";
import { LocalText } from "../constants/AppConstants";

const FirebaseDBPath = 'app/config';

var appConfig: AppConfig | undefined

export const GetAppConfig = () => appConfig

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
}