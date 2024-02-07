import { Category, StorageKey_FirstTimeInstallTick, StorageKey_LastInstalledVersion, StorageKey_LastTickTrackLocation, StorageKey_LastTrackCountryName } from "../../constants/AppConstants"
import { GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetNumberIntAsync, SetDateAsync_Now, SetNumberAsync } from "../AsyncStorageUtils"
import { MainTrack, TrackErrorOnFirebase } from "./Tracking"
import { versionAsNumber } from "../AppUtils"
import { FilterOnlyLetterAndNumberFromString, IsValuableArrayOrString, ToCanPrint } from "../UtilsTS"
import { UserID } from "../UserID"
import { Dimensions, Platform } from "react-native"
import { GetIPLocationAsync, IPLocation } from "../../hooks/useCountryFromIP"
import AsyncStorage from "@react-native-async-storage/async-storage"

let dimen = Dimensions.get('screen')
const radioOfScreen = Math.floor((Math.max(dimen.height, dimen.width) / Math.min(dimen.height, dimen.width)) * 100)

dimen = Dimensions.get('window')
const radioOfWindow = Math.floor((Math.max(dimen.height, dimen.width) / Math.min(dimen.height, dimen.width)) * 100)

export var location: IPLocation | undefined | string

/**
 * on first useEffect of the app (freshly open) or first active state of the day
 * . ONLY track ONCE a day
 */
export const track_FirstOpenOfTheDayAsync = async () => {
    // first_open_app_of_day

    let event = 'first_open_app_of_day'

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ])

    // newly_install

    const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

    if (firstTimeInstallTick === undefined) {
        //  newly install

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

        track_SimpleWithParam('dimension_screen', 's' + radioOfScreen)
        track_SimpleWithParam('dimension_window', 's' + radioOfWindow)

        // platform

        track_SimpleWithParam('platform', Platform.OS.toString())
    }
}

export const track_AppStateActive = (isActive: boolean) => {
    const event = isActive ? 'app_state_active' : 'app_state_inactive'

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ])
}

/**
 * freshly open app
 */
export const track_OnUseEffectOnceEnterAppAsync = async (startFreshlyOpenAppTick: number) => {
    let event = 'freshly_open_app'
    const elapsedOpenAppTime = Date.now() - startFreshlyOpenAppTick

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ],
        {
            time: elapsedOpenAppTime
        }
    )

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

export const track_PressNextPost = (shouldTracking: boolean, category: Category, isNextOrPrevious: boolean) => {
    if (!shouldTracking)
        return

    const event = isNextOrPrevious ? 'press_next_post' : 'press_previous_post'

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

export const track_Theme = (theme: string) => {
    const event = 'theme'

    MainTrack(event,
        [
            `total/${event}/` + theme,
            `total/${event}/all`,
        ],
        {
            theme
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
        // console.log('tracked todayyyy');
        return
    }

    // get location 

    location = await GetIPLocationAsync()

    if (typeof location === 'object') {
        if (IsValuableArrayOrString(location.country_name)) {
            SetDateAsync_Now(StorageKey_LastTickTrackLocation)

            const event = 'location'
            const country = FilterOnlyLetterAndNumberFromString(location.country_name)

            const lastTrackCountry = await AsyncStorage.getItem(StorageKey_LastTrackCountryName)

            if (country === lastTrackCountry) {
                // console.log('same country', country);
                return
            }
            else
                AsyncStorage.setItem(StorageKey_LastTrackCountryName, country)

            let regionOrCity = undefined

            if (IsValuableArrayOrString(location.city_name))
                regionOrCity = FilterOnlyLetterAndNumberFromString(location.city_name)
            else if (IsValuableArrayOrString(location.region_name))
                regionOrCity = FilterOnlyLetterAndNumberFromString(location.region_name)

            const fbArr = [
                `total/${event}/${country}/sum`,
            ]

            const obj = {
                country
            }

            if (regionOrCity) {
                fbArr.push(`total/${event}/${country}/` + regionOrCity)

                // @ts-ignore
                obj.region = regionOrCity
            }

            console.log('track location', ToCanPrint(obj));

            MainTrack(event,
                fbArr,
                obj)
        }
    }
}