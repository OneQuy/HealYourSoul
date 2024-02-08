import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import { startFreshlyOpenAppTick } from "./AppUtils"
import { checkAndTrackLocation, track_AppStateActive, track_FirstOpenOfTheDayAsync, track_OnUseEffectOnceEnterAppAsync } from "./tracking/GoodayTracking"
import { StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_LastTimeCheckFirstOpenAppOfTheDay } from "../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, SetDateAsync_Now } from "./AsyncStorageUtils"
import { NetLord } from "./NetLord"
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp"
import { CheckAndPrepareDataForNotificationAsync, setNotificationAsync } from "./GoodayNotification"
import { IsToday } from "./UtilsTS"

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

const onActiveOrOnceUseEffectAsync = async () => {
    checkAndFireActiveOrOnceUseEffectWithCheckDuplicateAsync()
}

const checkAndFireActiveOrOnceUseEffectWithCheckDuplicateAsync = async () => {

}

const onActiveAsync = async () => {
    // check to show warning alert

    checkAndReloadAppConfigAsync()

    // first Open App Of The Day

    CheckAndTriggerFirstOpenAppOfTheDayAsync()

    // track app state active

    track_AppStateActive(true)

    // onActiveOrOnceUseEffectAsync

    onActiveOrOnceUseEffectAsync()
}

const onBackgroundAsync = async () => {
    setNotificationAsync()

    // track app state inactive

    track_AppStateActive(false)
}

const onStateChanged = (state: AppStateStatus) => {
    if (state === 'active') {
        onActiveAsync()
    }
    else if (state === 'background') {
        onBackgroundAsync()
    }
}

/**
 * on freshly open app or first active of the day
 */
export const CheckAndTriggerFirstOpenAppOfTheDayAsync = async () => {
    const lastDateTrack = await GetDateAsync(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

    if (lastDateTrack !== undefined && IsToday(lastDateTrack))
        return

    SetDateAsync_Now(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

    // handles

    console.log('---- handle first open app of the day ------');

    track_FirstOpenOfTheDayAsync()

    // track location

    checkAndTrackLocation()
}

/**
 * freshly open app
 */
export const OnUseEffectOnceEnterApp = () => {
    track_OnUseEffectOnceEnterAppAsync(startFreshlyOpenAppTick)

    CheckAndTriggerFirstOpenAppOfTheDayAsync()
    CheckAndPrepareDataForNotificationAsync()
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}