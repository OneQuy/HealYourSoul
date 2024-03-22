import { CommonActions } from '@react-navigation/native';
import { Alert, AppStateStatus, Platform } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"
import { HandleStartupAlertAsync } from "./StartupAlert"
import { GoodayToast, startFreshlyOpenAppTick, versionAsNumber } from "./AppUtils"
import { SaveCachedPressNextPostAsync, checkAndTrackLocation, track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync, track_OnUseEffectOnceEnterAppAsync, track_OpenAppOfDayCount, track_ResetNavigation, track_SessionDuration, track_SimpleWithParam, track_Streak } from "./tracking/GoodayTracking"
import { FirebaseDatabaseTimeOutMs, LocalText, ScreenName, StorageKey_ClickNotificationOneSignal, StorageKey_GoodayAt, StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_LastTimeCheckFirstOpenAppOfTheDay, StorageKey_NeedToShowWhatsNewFromVer, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppOfDayCountForDate, StorageKey_OpenAppTotalCount, StorageKey_ScreenToInit, StorageKey_StreakLastTime } from "../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow, GetNumberIntAsync, GetPairNumberIntAndDateAsync, IncreaseNumberAsync, SetDateAsync_Now, SetNumberAsync, SetPairNumberIntAndDateAsync_Now, StorageAppendToArrayAsync, StorageGetArrayAsync } from "./AsyncStorageUtils"
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp"
import { CheckAndPrepareDataForNotificationAsync, setNotificationAsync } from "./GoodayNotification"
import { DayName, FilterOnlyLetterAndNumberFromString, IsToday, SafeValue } from "./UtilsTS"
import { NavigationProp } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HandleVersionsFileAsync } from './VersionsHandler';
import { GetStreakAsync, SetStreakAsync } from './Streak';
import { OneSignal } from 'react-native-onesignal';
import { FirebaseDatabase_GetValueAsyncWithTimeOut } from '../firebase/FirebaseDatabase';

const HowLongInMinutesToCount2TimesUseAppSeparately = 20

const HowLongToReloadInMinute = 30

type NavigationType = NavigationProp<ReactNavigation.RootParamList>

var lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = 0

var lastActiveTick = Date.now()

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
    const lastUpdate = await GetDateAsync(StorageKey_LastTimeCheckAndReloadAppConfig)

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
        ResetNavigation(lastUpdate)
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

    if (minFromLastCall < HowLongInMinutesToCount2TimesUseAppSeparately)
        return

    lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = Date.now()

    // handle here ------------------------------------

    const count = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)

    if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_OpenAppOfDayCountForDate)) { // already tracked yesterday, just inc today
        SetNumberAsync(StorageKey_OpenAppOfDayCount, count + 1)
    }
    else { // need to track for yesterday
        if (count > 0)
            track_OpenAppOfDayCount(count)

        SetDateAsync_Now(StorageKey_OpenAppOfDayCountForDate)
        SetNumberAsync(StorageKey_OpenAppOfDayCount, 1)
    }

    await IncreaseNumberAsync(StorageKey_OpenAppTotalCount)

    // track current time (hour) of using Gooday

    const { date, number } = await GetPairNumberIntAndDateAsync(StorageKey_GoodayAt, -1)
    const currentHour = new Date().getHours()

    if (number !== currentHour || !date || !IsToday(date)) {
        track_SimpleWithParam('gooday_at', currentHour + 'h')
        SetPairNumberIntAndDateAsync_Now(StorageKey_GoodayAt, currentHour)
    }
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

export const ResetNavigation = async (lastTime?: Date) => {
    if (!navigation)
        return

    try {
        const curScreen = await AsyncStorage.getItem(StorageKey_ScreenToInit);

        if (!curScreen)
            return

        track_ResetNavigation(lastTime)

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
    lastActiveTick = Date.now()

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

    // track session duration

    track_SessionDuration(Date.now() - lastActiveTick)
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

    // console.log('---- handle first open app of the day ------');

    track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync()

    // track location

    checkAndTrackLocation()

    // gooday streak

    HandleGoodayStreakAsync()

    // track day of week

    track_SimpleWithParam('gooday_week', DayName(undefined, true))
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

export const CheckAndShowAlertWhatsNewAsync = async (fromVer: number) => {
    if (!Number.isNaN(fromVer))
        await SetNumberAsync(StorageKey_NeedToShowWhatsNewFromVer, fromVer)
    else
        fromVer = await GetNumberIntAsync(StorageKey_NeedToShowWhatsNewFromVer)

    if (Number.isNaN(fromVer))
        return

    const configFromFb = await FirebaseDatabase_GetValueAsyncWithTimeOut('app/whats_new', FirebaseDatabaseTimeOutMs)

    if (!configFromFb.value)
        return

    const entries = Object.entries(configFromFb.value)
    let s = ''
    let versionsToTrack = ''

    for (let i = 0; i < entries.length; i++) {
        var key = entries[i][0]

        if (!key.startsWith('v') || key.length < 4)
            continue

        const configVerNum = Number.parseInt(key.substring(1))

        if (Number.isNaN(configVerNum))
            continue

        if (configVerNum <= fromVer || configVerNum > versionAsNumber)
            continue

        versionsToTrack += ('v' + configVerNum)

        if (s === '')
            s = entries[i][1] as string
        else
            s += '\n' + entries[i][1]
    }

    AsyncStorage.removeItem(StorageKey_NeedToShowWhatsNewFromVer)

    if (s === '') {
        return
    }

    s = s.replaceAll('@', '\n')

    Alert.alert(
        LocalText.update_updated,
        `${LocalText.whats_new} v${versionAsNumber}:\n\n ${s}`)

    track_SimpleWithParam('show_whats_new', versionsToTrack)
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
    else if (data.bestStreak > 1)
        GoodayToast(Math.random() > 0.5 ? LocalText.gooday_streak_1_welcome : LocalText.gooday_streak_1)
    else
        GoodayToast(LocalText.gooday_streak_1)

    // track

    if (!forceShow)
        track_Streak(data.currentStreak, data.bestStreak)
}

const SetupOneSignal = () => {
    OneSignal.User.addTag('version', versionAsNumber.toString())
    OneSignal.User.addTag('platform', Platform.OS)

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