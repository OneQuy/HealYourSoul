import { StorageKey_AdsEventCount } from "../../constants/AppConstants"
import { IncreaseNumberAsync } from "../AsyncStorageUtils"
import { track_Ads } from "../tracking/GoodayTracking"

const TrackAsync = async (evt: string) => {
    track_Ads(evt, await IncreaseNumberAsync(StorageKey_AdsEventCount(evt)))
}

export const OnAdmobInterstitial_Loaded = () => {
    TrackAsync('loaded')
}

export const OnAdmobInterstitial_Opened = () => {
    TrackAsync('opened')
}

export const OnAdmobInterstitial_Clicked = () => {
    TrackAsync('clicked')
}

export const OnAdmobInterstitial_Paid = () => {
    TrackAsync('paid')
}

export const OnAdmobInterstitial_Closed = () => {
    TrackAsync('closed')
}

export const OnAdmobInterstitial_Error = (e: Error) => {
    TrackAsync('error')
}