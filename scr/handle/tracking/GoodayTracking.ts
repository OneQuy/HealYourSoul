import { Category } from "../../constants/AppConstants"
import { MainTrack } from "./Tracking"


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