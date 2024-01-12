import { Category, StorageKey_FirstTimeInstallTick, StorageKey_LastInstalledVersion } from "../../constants/AppConstants"
import { GetDateAsync, GetNumberIntAsync, SetDateAsync_Now, SetNumberAsync } from "../AsyncStorageUtils"
import { MainTrack, TrackErrorOnFirebase } from "./Tracking"
import { versionAsNumber } from "../AppUtils"
import { ToCanPrint } from "../UtilsTS"

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
        SetDateAsync_Now(StorageKey_FirstTimeInstallTick)

        let event = 'newly_install'

        MainTrack(event,
            [
                `total/${event}`,
                `events/${event}/#d`,
            ])
    }
}

export const track_AppStateActive = () => {
    const event = 'app_state_active'

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

    if (!Number.isNaN(lastVersion) && lastVersion !== versionAsNumber) {
        SetNumberAsync(StorageKey_LastInstalledVersion, versionAsNumber)
        event = 'updated_app'

        MainTrack(event,
            [
                `total/${event}`,
                `events/${event}/#d`,
            ])
    }
}

export const track_PressNextPost = (shouldTracking: boolean, category: Category, isNextOrPrevious: boolean) => {
    if (!shouldTracking)
        return

    const event = isNextOrPrevious ? 'press_next_post' : 'press_previous_post'

    track_SimpleWithCat(category, event)
}

export const track_PressSaveMedia = (category: Category) => {
    track_SimpleWithCat(category, 'save_media')
}

export const track_SimpleWithCat = (category: Category, event: string) => {
    MainTrack(event,
        [
            `total/${event}/total`,
            `total/${event}/` + Category[category],
            `events/${event}/#d/` + Category[category],
        ],
        {
            cat: Category[category],
        }
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