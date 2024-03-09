import { CommonActions } from '@react-navigation/native';
import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import { GoodayToast, startFreshlyOpenAppTick, versionAsNumber } from "./AppUtils"
import { SaveCachedPressNextPostAsync, checkAndTrackLocation, track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync, track_OnUseEffectOnceEnterAppAsync, track_OpenAppOfDayCount, track_Simple, track_SimpleWithParam, track_Streak } from "./tracking/GoodayTracking"
import { LocalText, ScreenName, StorageKey_ClickNotificationOneSignal, StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_LastTimeCheckFirstOpenAppOfTheDay, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppOfDayCountForDate, StorageKey_OpenAppTotalCount, StorageKey_ScreenToInit, StorageKey_Streak, StorageKey_StreakLastTime } from "../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow, GetNumberIntAsync, IncreaseNumberAsync, SetDateAsync_Now, SetNumberAsync, StorageAppendToArrayAsync, StorageGetArrayAsync } from "./AsyncStorageUtils"
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp"
import { CheckAndPrepareDataForNotificationAsync, setNotificationAsync } from "./GoodayNotification"
import { FilterOnlyLetterAndNumberFromString, IsToday, SafeValue } from "./UtilsTS"
import { NavigationProp } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HandleVersionsFileAsync } from './VersionsHandler';
import { GetStreakAsync, SetStreakAsync } from './Streak';
import { OneSignal } from 'react-native-onesignal';

const HowLongInMinutesToCount2TimesUseAppSeparately = 20

const HowLongToReloadInMinute = 30

var lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = 0

type NavigationType = NavigationProp<ReactNavigation.RootParamList>

var isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

var navigation: NavigationType | undefined = undefined

var calledOnUseEffectOnceEnterApp = false

export const setNavigation = (navi: NavigationType) => {
    if (navi === navigation) {
        return
    }

    navigation = navi
}

/** reload (app config + file version) if app re-active after a period 1 HOUR */
const checkAndReloadAppAsync = async () => {
    if (!await GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow(
        StorageKey_LastTimeCheckAndReloadAppConfig,
        HowLongToReloadInMinute)) {
        console.log('[checkAndReloadAppAsync] no check reload cuz checked recently');
        return
    }

    // need to reload!

    const [successDownloadAppConfig, successDownloadFileVersion] = await Promise.all([
        HandleAppConfigAsync(),
        HandleVersionsFileAsync()
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

    if (successDownloadAppConfig && successDownloadFileVersion)
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

export const GoToScreen = (screen: ScreenName | string, param?: object) => {
    if (!navigation)
        return

    track_SimpleWithParam('goto_screen', screen)

    try {
        // @ts-ignore
        navigation.navigate(screen as never, param)
    }
    catch { }
}

export const ResetNavigation = async () => {
    if (!navigation)
        return

    console.log('[ResetNavigation]')

    try {
        const curScreen = await AsyncStorage.getItem(StorageKey_ScreenToInit);

        if (!curScreen)
            return

        track_Simple('reset_navigation')

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: curScreen },
                ],
            })
        )
    }
    catch { }
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

    // gooday streak

    HandleGoodayStreakAsync()
}

/**
 * freshly open app
 */
export const OnUseEffectOnceEnterApp = () => {
    if (calledOnUseEffectOnceEnterApp) {
        return
    }

    calledOnUseEffectOnceEnterApp = true

    track_OnUseEffectOnceEnterAppAsync(startFreshlyOpenAppTick)

    CheckAndTriggerFirstOpenAppOfTheDayAsync()
    CheckAndPrepareDataForNotificationAsync()
    onActiveOrOnceUseEffectAsync()
    SetupOneSignal()
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}

export const HandleGoodayStreakAsync = async (forceShow = false) => {
    const id = 'gooday'

    const handled = await SetStreakAsync(id)

    if (!handled && !forceShow) // already showed
        return

    const data = await GetStreakAsync(id)

    if (!data)
        return

    const streakLastTime = await GetNumberIntAsync(StorageKey_StreakLastTime)

    if (data.currentStreak === streakLastTime && !forceShow)
        return

    SetNumberAsync(StorageKey_StreakLastTime, data.currentStreak)

    if (data.currentStreak > 1)
        GoodayToast(LocalText.gooday_streak_2.replaceAll('##', data.currentStreak.toString()))
    else
        GoodayToast(LocalText.gooday_streak_1)

    // track

    if (!forceShow)
        track_Streak(data.currentStreak)
}

const SetupOneSignal = () => {
    OneSignal.User.addTag('version', versionAsNumber.toString())

    // Method for listening for notification clicks

    OneSignal.Notifications.addEventListener('click', (event) => {
        const title = SafeValue(event?.notification?.title, 'v' + versionAsNumber)
        const value = FilterOnlyLetterAndNumberFromString(title)

        StorageAppendToArrayAsync(StorageKey_ClickNotificationOneSignal, value)
    })

    // track old click notification

    StorageGetArrayAsync(StorageKey_ClickNotificationOneSignal).then((s) => {
        s.forEach(element => {
            track_SimpleWithParam('click_onesignal', element)
        });

        AsyncStorage.removeItem(StorageKey_ClickNotificationOneSignal)
    })
}