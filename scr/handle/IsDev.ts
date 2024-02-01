import { StorageKey_ForceDev } from "../constants/AppConstants"
import { GetAppConfig } from "./AppConfigHandler"
import { GetBooleanAsync } from "./AsyncStorageUtils"

var isDev = true

export const IsDev = () => isDev

export const CheckIsDevAsync = async (): Promise<void> => {

    const isDevSaved = await GetBooleanAsync(StorageKey_ForceDev)

    if (__DEV__ || isDevSaved)
        isDev = true
    else {
        const config = GetAppConfig()

        if (!config) {
            isDev = false
        }
        else
            isDev = config.force_dev
    }
}