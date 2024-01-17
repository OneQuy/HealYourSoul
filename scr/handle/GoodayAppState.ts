import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import { CheckAndTriggerFirstOpenAppOfTheDayAsync } from "./AppUtils"
import { track_AppStateActive } from "./tracking/GoodayTracking"
import { StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_Quote_DataNoti } from "../constants/AppConstants"
import { GetDateAsync_IsValueExistedAndIsToday, SetDateAsync_Now } from "./AsyncStorageUtils"
import { NetLord } from "./NetLord"
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setNotification_RemainSeconds } from "./Nofitication"
import { PickRandomElement } from "./Utils"

/** only reload if app re-active after a period 1 day */
const checkAndReloadAppConfigAsync = async () => {
    if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_LastTimeCheckAndReloadAppConfig)) {
        console.log('[checkAndReloadAppConfigAsync] no check cuz checked today');
        return
    }

    // need to reload!

    if (!NetLord.IsAvailableLastestCheck()) {
        console.log('[checkAndReloadAppConfigAsync] no check cuz no network');
        return
    }

    const success = await HandleAppConfigAsync()

    if (!success)
        return

    SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)

    await onAppConfigReloadedAsync()
}

const onAppConfigReloadedAsync = async () => {
    // startup alert

    await HandleStartupAlertAsync() // alert_priority 1 (doc)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)
}

const setNotification = async () => {
    // quote

    const quotesTxt = await AsyncStorage.getItem(StorageKey_Quote_DataNoti)

    if (quotesTxt !== null) {
        const quotes = JSON.parse(quotesTxt) as {}[]

        console.log(quotes.length);

        for (let i = 0; i < 10 && i < quotes.length; i++) {
            let time = i * 30

            if (time <= 0)
                time = 10

            const quote = PickRandomElement(quotes)
            
            console.log(time, quote);

            setNotification_RemainSeconds(time, {
                // @ts-ignore
                title: quote.author,

                // @ts-ignore
                message: quote.content,
            })
        }
    }

}

const onActiveAsync = async () => {
    // check to show warning alert

    checkAndReloadAppConfigAsync()

    // first Open App Of The Day

    CheckAndTriggerFirstOpenAppOfTheDayAsync()

    // track app state active

    track_AppStateActive()
}

const onBackgroundAsync = async () => {
    setNotification()
}

const onStateChanged = (state: AppStateStatus) => {
    if (state === 'active') {
        onActiveAsync()
    }
    else if (state === 'background') {
        onBackgroundAsync()
    }
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}