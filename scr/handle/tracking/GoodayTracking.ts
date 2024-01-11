import { Category } from "../../constants/AppConstants"
import { MainTrack } from "./Tracking"

/**
 * on first useEffect of the app (freshly open) or first active state of the day
 * , only track once a day
 */
export const track_FirstOpenOfTheDay = () => {
    const event = 'first_open_app_of_day'

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ])
}

export const track_AppStateActive = () => {
    const event = 'app_state_active'

    MainTrack(event,
        [
            `total/${event}`,
            `events/${event}/#d`,
        ])
}

export const track_OnUseEffectOnceEnterApp = (startFreshlyOpenAppTick: number) => {
    const event = 'freshly_open_app'
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
}

export const track_PressNextPost = (shouldTracking: boolean, category: Category, isNextOrPrevious: boolean) => {
    if (!shouldTracking)
        return

    const event = isNextOrPrevious ? 'press_next_post' : 'press_previous_post'

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