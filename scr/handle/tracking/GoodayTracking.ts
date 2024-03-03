import { Category, StorageKey_CachedPressNextPost, StorageKey_FirstTimeInstallTick, StorageKey_LastFreshlyOpenApp, StorageKey_LastInstalledVersion, StorageKey_LastTickTrackLocation, StorageKey_LastTrackCountryName, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppTotalCount } from "../../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetNumberIntAsync, SetDateAsync_Now, SetNumberAsync } from "../AsyncStorageUtils"
import { MainTrack, TrackErrorOnFirebase } from "./Tracking"
import { versionAsNumber } from "../AppUtils"
import { DistanceFrom2Dates, FilterOnlyLetterAndNumberFromString, GetDayHourMinSecFromMs_ToString, IsValuableArrayOrString, ToCanPrint } from "../UtilsTS"
import { UserID } from "../UserID"
import { Dimensions, Platform } from "react-native"
import { GetIPLocationAsync, IPLocation } from "../../hooks/useCountryFromIP"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CachedValueOfCatelogry } from "../../constants/Types"

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

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ],
        { // should not put string values here.
            openTime,
            totalOpenAppCount,
            openTodaySoFar,
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

    const lastVersion = await GetNumberIntAsync(StorageKey_LastInstalledVersion)

    SetNumberAsync(StorageKey_LastInstalledVersion, versionAsNumber)

    if (!Number.isNaN(lastVersion) && lastVersion !== versionAsNumber) {
        event = 'updated_app'

        MainTrack(event,
            [
                `total/${event}`,
                `events/${event}/#d`,
            ])

        track_SimpleWithParam('versions', 'v' + versionAsNumber)
    }
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

export const track_SimpleWithCat = (category: Category, event: string, trackDate: boolean = true) => {
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

export const track_PressYearOfAwardPicture = (year: string) => {
    track_SimpleWithParam('select_year_award_pic', year)
}

export const track_PressRandom = (shouldTracking: boolean, category: Category, success: boolean | undefined) => {
    if (!shouldTracking)
        return

    MainTrack('press_random',
        [
            'total/press_random/total',
            'total/press_random/' + Category[category],
            'events/press_random/#d/' + Category[category],
        ],
        {
            cat: Category[category],
            success: success === undefined ? 'none' : success.toString()
        }
    )
}

export const track_PressDrawerItem = (screen: string) => {
    const event = 'press_drawer_item'

    MainTrack(event,
        [
            `total/${event}/total`,
            `total/${event}/` + screen,

            `events/${event}/#d/` + screen
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

            `events/${event}/#d/` + Category[category] + '/' + (isFavorited ? 'like' : 'dislike'),
        ],
        {
            cat: Category[category],
            isFavorited
        }
    )
}

export const track_HandleError = (methodName: string, error: any) => {
    track_SimpleWithParam('error', methodName)

    const s = '' + ToCanPrint(error)
    TrackErrorOnFirebase(s)
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

export const track_Streak = (count: number) => {
    const event = 'streak'

    MainTrack(event,
        [
            `total/${event}/${count}_gooday`,
        ],
        {
            count
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