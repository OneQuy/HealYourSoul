import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_LastTimeCheckShowWarningAlert } from "../constants/AppConstants"
import { IsToday } from "./UtilsTS"
import { OnFirstOpenAppOfTheDayAsync } from "./AppUtils"
import { track_AppStateActive } from "./tracking/GoodayTracking"

const checkAndShowWaringAlertAsync = async () => {
    const lastTimeCheckS = await AsyncStorage.getItem(StorageKey_LastTimeCheckShowWarningAlert)

    if (lastTimeCheckS && typeof lastTimeCheckS === 'string') {
        const tick = Number.parseInt(lastTimeCheckS)
        const date = new Date(tick)

        if (IsToday(date)) {
            // console.log('same day no check');
            return
        }
    }

    const success = await HandleAppConfigAsync()

    if (!success)
        return

    AsyncStorage.setItem(StorageKey_LastTimeCheckShowWarningAlert, Date.now().toString())

    HandleStartupAlertAsync()
}

const onActiveAsync = async () => {
    // check to show warning alert

    checkAndShowWaringAlertAsync()

    // first Open App Of The Day

    OnFirstOpenAppOfTheDayAsync()

    // track app state active

    track_AppStateActive()
}

const onStateChanged = (state: AppStateStatus) => {
    if (state === 'active') {
        onActiveAsync()
    }
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}