import { CommonActions } from '@react-navigation/native';
import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import { startFreshlyOpenAppTick } from "./AppUtils"
import { SaveCachedPressNextPostAsync, checkAndTrackLocation, track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync, track_OnUseEffectOnceEnterAppAsync, track_OpenAppOfDayCount } from "./tracking/GoodayTracking"
import { StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_LastTimeCheckFirstOpenAppOfTheDay, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppOfDayCountForDate, StorageKey_OpenAppTotalCount, StorageKey_ScreenToInit } from "../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetDateAsync_IsValueExistedAndIsTodayAndSameHour, GetNumberIntAsync, IncreaseNumberAsync, SetDateAsync_Now, SetNumberAsync } from "./AsyncStorageUtils"
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp"
import { CheckAndPrepareDataForNotificationAsync, setNotificationAsync } from "./GoodayNotification"
import { IsToday } from "./UtilsTS"
import { NavigationProp } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HandleVersionsFileAsync } from './VersionsHandler';

const HowLongInMinutesToCount2TimesUseAppSeparately = 20

var lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = 0

type NavigationType = NavigationProp<ReactNavigation.RootParamList>

var isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

var navigation: NavigationType | undefined = undefined

export const setNavigation = (navi: NavigationType) => {
    if (navi === navigation) {
        console.log('already set navi');
        return
    }

    navigation = navi
}

/** reload (app config + file version) if app re-active after a period 1 HOUR */
const checkAndReloadAppAsync = async () => {
    // const d = await GetDateAsync(StorageKey_LastTimeCheckAndReloadAppConfig)

    // if (d !== undefined && d.getMinutes() === new Date().getMinutes()) {
    //     console.log('[checkAndReloadAppAsync] no check cuz checked this minnnnn');
    //     return
    // }

    if (await GetDateAsync_IsValueExistedAndIsTodayAndSameHour(StorageKey_LastTimeCheckAndReloadAppConfig)) {
        console.log('[checkAndReloadAppAsync] no check cuz checked this hour');
        return
    }

    // need to reload!

    // if (!NetLord.IsAvailableLastestCheck()) {
    //     console.log('[checkAndReloadAppConfigAsync] no check cuz no network');
    //     return
    // }

    // download

    const [successDownloadAppConfig, successDownloadFileVersion] = await Promise.all([
        await HandleAppConfigAsync(),
        await HandleVersionsFileAsync()
    ])

    console.log('successDownloadAppConfig', successDownloadAppConfig);
    console.log('successDownloadFileVersion', successDownloadFileVersion);

    // handle app config

    if (successDownloadAppConfig)
        await onAppConfigReloadedAsync()

    // handle file version

    if (successDownloadFileVersion) { // reset screen
        ResetNavigation()
    }

    // set tick

    if (successDownloadAppConfig || successDownloadFileVersion)
        SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)
}

const onAppConfigReloadedAsync = async () => {
    console.log('[onAppConfigReloadedAsync]')

    // startup alert

    await HandleStartupAlertAsync() // alert_priority 1 (doc)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)
}

/**
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. whenever onAppActive
 */
const onActiveOrOnceUseEffectAsync = async () => {
    checkAndFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync()
}

/**
 * use to count open app times
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. onAppActive (but at least 20p after the last call this method)
 */
const checkAndFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync = async () => {
    const distanceMs = Date.now() - lastFireOnActiveOrOnceUseEffectWithCheckDuplicate

    const minFromLastCall = distanceMs / 1000 / 60

    // console.log('minFromLastCall', minFromLastCall);

    if (minFromLastCall < HowLongInMinutesToCount2TimesUseAppSeparately)
        return

    lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = Date.now()

    // handle here ------------------------------------

    const count = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)

    // console.log('checkAndFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync');

    if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_OpenAppOfDayCountForDate)) { // already tracked yesterday, just inc today
        SetNumberAsync(StorageKey_OpenAppOfDayCount, count + 1)
        // console.log('inc today to', count + 1);
    }
    else { // need to track for yesterday
        if (count > 0)
            track_OpenAppOfDayCount(count)

        SetDateAsync_Now(StorageKey_OpenAppOfDayCountForDate)
        SetNumberAsync(StorageKey_OpenAppOfDayCount, 1)

        // console.log('reset for today', count);
    }

    await IncreaseNumberAsync(StorageKey_OpenAppTotalCount)
}

const ResetNavigation = async () => {
    if (!navigation)
        return

    console.log('[ResetNavigation]')

    try {
        const curScreen = await AsyncStorage.getItem(StorageKey_ScreenToInit);

        if (!curScreen)
            return

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: curScreen },
                ],
            })
        )
    }
    catch {
    }
}

const onActiveAsync = async () => {
    // check to show warning alert

    checkAndReloadAppAsync()

    // first Open App Of The Day

    CheckAndTriggerFirstOpenAppOfTheDayAsync()

    // onActiveOrOnceUseEffectAsync

    onActiveOrOnceUseEffectAsync()
}

const onBackgroundAsync = async () => {
    setNotificationAsync()

    // SaveCachedPressNextPost

    SaveCachedPressNextPostAsync()
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
    if (isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync) {
        return
    }

    isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = true

    const lastDateTrack = await GetDateAsync(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

    if (lastDateTrack !== undefined && IsToday(lastDateTrack)) {
        isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false
        return
    }

    await SetDateAsync_Now(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)
    isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

    // handles

    console.log('---- handle first open app of the day ------');

    track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync()

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
    onActiveOrOnceUseEffectAsync()
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}