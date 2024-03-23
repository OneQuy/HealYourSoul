import { Category, StorageKey_CachedPressNextPost, StorageKey_FirstTimeInstallTick, StorageKey_LastFreshlyOpenApp, StorageKey_LastInstalledVersion, StorageKey_LastTickTrackLocation, StorageKey_LastTrackCountryName, StorageKey_MiniIAPCount, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppTotalCount, StorageKey_PressUpdateObject } from "../../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetNumberIntAsync, GetPairNumberIntAndDateAsync, SetDateAsync_Now, SetNumberAsync } from "../AsyncStorageUtils"
import { MainTrack, TrackErrorOnFirebase } from "./Tracking"
import { versionAsNumber } from "../AppUtils"
import { DateDiff_WithNow, FilterOnlyLetterAndNumberFromString, GetDayHourMinSecFromMs_ToString, IsNumType, IsValuableArrayOrString, TimeOutError, ToCanPrint } from "../UtilsTS"
import { UserID } from "../UserID"
import { Dimensions, Platform } from "react-native"
import { GetIPLocationAsync, IPLocation } from "../../hooks/useCountryFromIP"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CachedValueOfCatelogry } from "../../constants/Types"
import { CheckAndShowAlertWhatsNewAsync } from "../GoodayAppState"

export var location: IPLocation | undefined | string
var cachedPressNextPost: CachedValueOfCatelogry[] | undefined = undefined

var isNewlyInstall: boolean = false

export const IsNewlyInstall = () => isNewlyInstall

/**
 * on first useEffect of the app (freshly open) or first active state of the day
 * . ONLY track ONCE a day
 */
export const track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync = async () => {
    // newly_install

    const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

    if (firstTimeInstallTick === undefined) {
        isNewlyInstall = true

        SetDateAsync_Now(StorageKey_FirstTimeInstallTick)

        let event = 'newly_install'

        MainTrack(event,
            [
                `total/${event}`,
                `events/${event}/#d`,
            ],
            {
                userID: UserID(),
            })

        // version

        track_SimpleWithParam('versions', 'v' + versionAsNumber)

        // dimension

        let dimen = Dimensions.get('screen')
        const radioOfScreen = Math.floor((Math.max(dimen.height, dimen.width) / Math.min(dimen.height, dimen.width)) * 100)

        dimen = Dimensions.get('window')
        const radioOfWindow = Math.floor((Math.max(dimen.height, dimen.width) / Math.min(dimen.height, dimen.width)) * 100)

        track_SimpleWithParam('dimension_screen', 's' + radioOfScreen)
        track_SimpleWithParam('dimension_window', 's' + radioOfWindow)

        // platform

        track_SimpleWithParam('platform', Platform.OS.toString())
    }

    // old user

    else {
        let event = 'first_open_of_day_old_user'
        const totalOpenAppCount = await GetNumberIntAsync(StorageKey_OpenAppTotalCount, 0)

        const installedDaysCountDiff = Date.now() - firstTimeInstallTick.getTime()
        const installedDaysCount = GetDayHourMinSecFromMs_ToString(installedDaysCountDiff)

        MainTrack(event,
            [
                `events/${event}/#d`,
            ],
            {
                installedDaysCount,
                userId: UserID(),
                totalOpenAppCount,
            })
    }
}

/**
 * freshly open app
 */
export const track_OnUseEffectOnceEnterAppAsync = async (startFreshlyOpenAppTick: number) => {
    let event = 'freshly_open_app'

    const openTime = Date.now() - startFreshlyOpenAppTick
    const totalOpenAppCount = await GetNumberIntAsync(StorageKey_OpenAppTotalCount, 0)
    const openTodaySoFar = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)

    const installedDate = await GetDateAsync(StorageKey_FirstTimeInstallTick)
    const installedDateCount = installedDate ? Math.floor(DateDiff_WithNow(installedDate)) : 0

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ],
        { // should not put string values here.
            openTime,
            totalOpenAppCount,
            openTodaySoFar,
            installedDateCount,
        }
    )

    // lastFreshlyOpenAppTick

    const lastFreshlyOpenAppTick = await GetDateAsync(StorageKey_LastFreshlyOpenApp)
    SetDateAsync_Now(StorageKey_LastFreshlyOpenApp)

    let lastFreshlyOpenAppToNowMs = 0

    if (lastFreshlyOpenAppTick !== undefined) {
        lastFreshlyOpenAppToNowMs = Date.now() - lastFreshlyOpenAppTick.getTime()
    }

    let lastFreshlyOpenAppToNow = GetDayHourMinSecFromMs_ToString(lastFreshlyOpenAppToNowMs)

    if (!IsValuableArrayOrString(lastFreshlyOpenAppToNow))
        lastFreshlyOpenAppToNow = 'no_data'

    MainTrack('last_freshly_open',
        [],
        {
            last_time: lastFreshlyOpenAppToNow,
            userId: UserID(),
        })

    // track update version

    const lastInstalledVersion = await GetNumberIntAsync(StorageKey_LastInstalledVersion)

    SetNumberAsync(StorageKey_LastInstalledVersion, versionAsNumber)
    let didUpdated = false

    if (!Number.isNaN(lastInstalledVersion) && lastInstalledVersion !== versionAsNumber) {
        didUpdated = true
        event = 'updated_app'

        const objLastAlertText = await AsyncStorage.getItem(StorageKey_PressUpdateObject)
        let lastAlert = 'no_data'
        let obj

        if (objLastAlertText) {
            AsyncStorage.removeItem(StorageKey_PressUpdateObject)

            obj = JSON.parse(objLastAlertText)

            if (obj && typeof obj.last_alert_tick === 'number')
                lastAlert = GetDayHourMinSecFromMs_ToString(Date.now() - obj.last_alert_tick)
        }

        MainTrack(event,
            [
                `total/${event}`,
            ],
            {
                from: 'v' + lastInstalledVersion,
                lastAlert,
                ...obj,
            })

        track_SimpleWithParam('versions', 'v' + versionAsNumber)
    }

    // show alert whats new

    CheckAndShowAlertWhatsNewAsync(didUpdated ? lastInstalledVersion : NaN) // alert_priority 'not_important' (doc)
}

export const SaveCachedPressNextPostAsync = async () => {
    if (!cachedPressNextPost)
        return

    AsyncStorage.setItem(StorageKey_CachedPressNextPost, JSON.stringify(cachedPressNextPost))

    // console.log('saved', JSON.stringify(cachedPressNextPost));

}

export const track_PressNextPost = async (shouldTracking: boolean, category: Category, isNextOrPrevious: boolean) => {
    if (!shouldTracking)
        return

    const event = isNextOrPrevious ? 'press_next_post_x5' : 'press_previous_post'


    if (isNextOrPrevious) {
        if (cachedPressNextPost === undefined) { // not load cached yet
            const s = await AsyncStorage.getItem(StorageKey_CachedPressNextPost)

            if (s) {
                cachedPressNextPost = JSON.parse(s) as CachedValueOfCatelogry[]
                AsyncStorage.removeItem(StorageKey_CachedPressNextPost)
            }
            else
                cachedPressNextPost = []

            // console.log('loaded ', ToCanPrint(cachedPressNextPost));
        }

        let item = cachedPressNextPost.find(i => i.cat === category)

        if (item === undefined) {
            item = {
                value: 1,
                cat: category
            }

            cachedPressNextPost.push(item)
        }
        else {
            item.value++
        }

        // console.log('now', ToCanPrint(item));

        if (item.value < 5) {
            return
        }
        else
            item.value = 0
    }

    track_SimpleWithCat(category, event)
}

export const track_PressNextPostMedia = (category: Category, isNextOrPrevious: boolean) => {
    const event = isNextOrPrevious ? 'press_next_media' : 'press_previous_media'

    track_SimpleWithCat(category, event)
}

export const track_PressSaveMedia = (category: Category) => {
    track_SimpleWithCat(category, 'save_media')
}

export const track_ToggleNotification = (type: string, toggle: boolean) => {
    const event = 'toggle_noti'

    MainTrack(event,
        [
            `total/${event}/${type}/${toggle ? 'on' : 'off'}`
        ],
        {
            type,
            toggle
        }
    )
}

export const track_SessionDuration = (ms: number) => {
    const event = 'session_duration'

    const inMin = Math.floor(ms / 1000 / 60)

    MainTrack(event,
        [
            `total/${event}/${inMin}m/`,
        ],
        {
            durationInSeconds: Math.floor(ms / 1000),
        }
    )
}

export const track_SimpleWithCat = (category: Category, event: string, trackDate: boolean = false) => {
    const fbArr = [
        `total/${event}/total`,
        `total/${event}/` + Category[category],
    ]

    if (trackDate == true)
        fbArr.push(`events/${event}/#d/` + Category[category])

    MainTrack(event,
        fbArr,
        {
            cat: Category[category],
        }
    )
}

export const track_ResetNavigation = (lastUpdateConfig?: Date) => {
    const event = 'reset_navigation'

    const fbArr = [
        `total/${event}`,
    ]

    const lastTime = lastUpdateConfig === undefined ? 'no_data' : GetDayHourMinSecFromMs_ToString((Date.now() - lastUpdateConfig.getTime()))

    MainTrack(event,
        fbArr,
        {
            lastUpdateConfig: lastTime,
        }
    )
}

export const track_Simple = (event: string) => {
    MainTrack(event,
        [
            `total/${event}`,
        ]
    )
}

export const track_SimpleWithParam = (event: string, value: string) => {
    MainTrack(event,
        [
            `total/${event}/` + value,
        ],
        {
            value,
        }
    )
}

export const track_Ads = async (type: string, count: number) => {
    const event = 'ads'
    const { number: triggerCount } = await GetPairNumberIntAndDateAsync(StorageKey_MiniIAPCount)

    MainTrack(event,
        [
            `total/${event}/` + type,
        ],
        {
            type,
            count,
            triggerCount: IsNumType(triggerCount) ? triggerCount : 0,
        }
    )
}

export const track_PopupSelect = (cat: Category, value: string) => {
    const event = 'popup_select'

    MainTrack(event,
        [
            `total/${event}/${Category[cat]}/` + value,
        ],
        {
            value,
            cat: Category[cat],
        }
    )
}

export const track_PressYearOfAwardPicture = (year: string) => {
    track_SimpleWithParam('select_year_award_pic', year)
}

/**
 * 
 * @param subtype can includes space
 * @returns 
 */
export const track_PressRandom = (shouldTracking: boolean, category: Category, success: boolean | undefined, subtype?: string) => {
    if (!shouldTracking)
        return

    subtype = subtype ? FilterOnlyLetterAndNumberFromString(subtype) : 'none'

    MainTrack('press_random',
        [
            'total/press_random/total',
            'total/press_random/' + Category[category],
        ],
        {
            cat: Category[category],
            success: success === undefined ? 'none' : success.toString(),
            subtype,
        }
    )
}

export const track_PressDrawerItem = (screen: string) => {
    const event = 'press_drawer_item'

    MainTrack(event,
        [
            `total/${event}/total`,
            `total/${event}/` + screen,

            // `events/${event}/#d/` + screen
        ],
        {
            screen
        })
}

export const track_PressFavorite = (category: Category, isFavorited: boolean) => {
    const event = 'press_favorite'

    MainTrack(event,
        [
            `total/${event}/total`,
            `total/${event}/` + Category[category] + '/' + (isFavorited ? 'like' : 'dislike'),

            // `events/${event}/#d/` + Category[category] + '/' + (isFavorited ? 'like' : 'dislike'),
        ],
        {
            cat: Category[category],
            isFavorited
        }
    )
}

export const track_HandleError = (methodName: string, error: any) => {
    const s = '' + ToCanPrint(error)

    if (s === TimeOutError)
        return

    TrackErrorOnFirebase(`[${methodName}] ${s}`)
}

export const checkAndTrackLocation = async () => {
    const isTrackedToday = await GetDateAsync_IsValueExistedAndIsToday(StorageKey_LastTickTrackLocation)

    if (isTrackedToday) {
        return
    }

    // get location 

    location = await GetIPLocationAsync()

    if (typeof location !== 'object')
        return

    if (!IsValuableArrayOrString(location.country_name))
        return

    SetDateAsync_Now(StorageKey_LastTickTrackLocation)

    const event = 'location'
    const country = FilterOnlyLetterAndNumberFromString(location.country_name)

    const lastTrackCountry = await AsyncStorage.getItem(StorageKey_LastTrackCountryName)

    if (country === lastTrackCountry) {
        return
    }
    else
        AsyncStorage.setItem(StorageKey_LastTrackCountryName, country)

    let region = undefined

    if (IsValuableArrayOrString(location.region_name))
        region = FilterOnlyLetterAndNumberFromString(location.region_name)

    const fbArr = [
        `total/${event}/${country}/sum`,
    ]

    if (region) {
        fbArr.push(`total/${event}/${country}/` + region)
    }

    console.log('****** track location', ToCanPrint(location));

    if (location) {
        // @ts-ignore
        location.last_tracked_country = lastTrackCountry
    }

    MainTrack(event, fbArr, location)
}

export const track_RateInApp = async (starNumber: number) => {
    let event = 'rate_in_app'

    MainTrack(event,
        [
            `total/${event}/${starNumber}_star`,
        ],
        {
            starNumber
        }
    )
}

export const track_OpenAppOfDayCount = (count: number) => {
    const event = 'open_app_of_day_count'

    MainTrack(event,
        [
            `total/${event}/${count}_times`,
        ],
        {
            count
        }
    )
}

export const track_Streak = (count: number, bestStreak: number) => {
    const event = 'streak'

    MainTrack(event,
        [
            `total/${event}/${count}_gooday`,
        ],
        {
            count,
            bestStreak,
        }
    )
}

export const track_MaxSavedCount = (count: number) => {
    const event = 'max_saved'

    MainTrack(event,
        [
            `total/${event}/${count}_saved`,
        ],
        {
            count
        }
    )
}