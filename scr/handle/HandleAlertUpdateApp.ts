import { GetAppConfig } from "./AppConfigHandler"
import { OpenStore, versionAsNumber } from "./AppUtils"
import { LocalText, StorageKey_LastAskForUpdateApp } from "../constants/AppConstants"
import { Alert, AlertButton, Platform } from "react-native"
import { GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow, SetDateAsync_Now } from "./AsyncStorageUtils"

const isLog = false

export const HandldAlertUpdateAppAsync = async () => {
    const config = GetAppConfig()

    if (!config || !config.latest_version) {
        if (isLog)
            console.log('[HandldAlertUpdateAppAsync] NOT show cuz app config null')

        return
    }

    const data = Platform.OS === 'android' ? config.latest_version.android : config.latest_version.ios

    if (data.version <= versionAsNumber) {
        if (isLog)
            console.log('[HandldAlertUpdateAppAsync] NOT show cuz now is latest version')

        return
    }

    if (data.required > versionAsNumber) {
        data.force_update = true
    }

    if (!data.force_update) {
        const isValueNotExistedOrEqualOverDayFromNow = await GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow(StorageKey_LastAskForUpdateApp, data.day_diff_to_ask)

        if (!isValueNotExistedOrEqualOverDayFromNow) {
            if (isLog)
                console.log('[HandldAlertUpdateAppAsync] NOT show cuz aksed recently')

            return
        }

        SetDateAsync_Now(StorageKey_LastAskForUpdateApp)
    }

    // show!

    let releaseNote = data.release_note

    if (releaseNote) {
        releaseNote = releaseNote.replaceAll('@', '\n')
    }

    await new Promise((resolve) => {
        const arrBtn: AlertButton[] = []

        if (!data.force_update) {
            arrBtn.push({
                text: LocalText.later,
                onPress: () => {
                    resolve(true)
                }
            })
        }

        arrBtn.push({
            text: LocalText.update,
            onPress: () => {
                OpenStore()

                if (!data.force_update)
                    resolve(true)
            }
        })

        const content = '\n' + releaseNote + '\n' + LocalText.update_content

        Alert.alert(
            LocalText.update_title + ' (v' + data.version + ')',
            content,
            arrBtn,
            {
                cancelable: false, // android
            }
        )
    })
}