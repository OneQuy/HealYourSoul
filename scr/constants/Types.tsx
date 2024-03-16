import { Category, LocalText, NotLimitUploadsValue, ScreenName } from "./AppConstants"

export enum MediaType {
    Image = 0,
    Video = 1
}

// PostMetadata ------------------------------

export const CheckAndFillEmptyPropertiesPost = (rawPost: PostMetadata): PostMetadata => {
    rawPost.title = rawPost.title ?? ''
    rawPost.author = rawPost.author ?? ''
    rawPost.url = rawPost.url ?? ''
    rawPost.media = rawPost.media ?? [MediaType.Image]

    return rawPost
}

export type PostMetadata = {
    id: number,
    title: string,
    author: string,
    url: string,
    media: MediaType[],
}

// PostMetadata ------------------------------

export type FileList = {
    version: number,
    posts: PostMetadata[]
}

export type BackgroundForTextType = {
    "id": number
    "isLightBg": number,
    "isPremium": number,
    "img": string,
    "thumb": string,
}

export type CachedValueOfCatelogry = {
    value: number,
    cat: Category,
}

export type LatestVersionConfig = {
    version: number,
    force_update: boolean,
    release_note: string,
    day_diff_to_ask: number,
    required: number,
}

export type UserUploadPostStatus = 'approved' | '' | 'rejected' | 'banned'

export type User = {
    inboxes?: Inbox[],

    uploadLimit?: {
        uploadBannedReason?: string,

        /**
         * + only valuable if uploadBannedReason is valuable. 
         * + uploadExpirdedDate = -1 or undefined if banned permanented
         * + uploadExpirdedDate >= 0 if is a exp banned
         */
        uploadExpirdedDate?: number,

        /**
         * only for free user
         */
        uploadsPerDay?: number,
    }
}

export const CreateDefaultUser = (): User => ({
    uploadLimit: {
        uploadBannedReason: '',
        uploadExpirdedDate: -1,
        uploadsPerDay: NotLimitUploadsValue,
    }
})

export type Inbox = {
    /**
     * required
     */
    tickAsId: number,

    /**
     * required
     */
    msg: string,

    title: string | null,
    imgUri: string | null,

    /**
     *  must valuable to show btn and (primaryBtnUrl | primaryBtnGoToScreen) is valuable
     */
    primaryBtnTxt: string | null,
    primaryBtnUrl: string | null,
    primaryBtnGoToScreen: string | null,

    // goToScreenParamObj: object | null,

    approvedUploadedDiversity?: DiversityItemType,

    /**
     *  client set only
     */
    didRead?: boolean

    /**
     *  client set only
     */
    isLoved?: boolean
}

export type UserUploadInfo = {
    /**
     * with ext
     */
    filename: string,

    isPremium: boolean,
    status: UserUploadPostStatus,
}

export type DiversityItemType = {
    cat: Category,
    id?: string | number, // the page
    randomImage?: RandomImage,
    text?: string, // short text
    wikipediaObject?: object,
}

export type AppConfig = {
    net_url: string,
    remote_files: object,
    force_dev_01: number,
    count_trigger_mini_iap: number,
    userUploadLimit: {
        freeUserUploadsPerDay: number,
        intervalInMinute: number, // for both user free and premium.
    },
    latest_version: {
        android: LatestVersionConfig,
        ios: LatestVersionConfig,
    },
    notice?: {
        max_version: number,
        content: string,
        link: string,
        is_press_to_open_store: boolean,
    },
    startup_alert?: {
        max_version: number,
        id: string,
        title: string,
        content: string,
        allow_enter_app: boolean,
        button_link: string,
        button_link_title: string,
        show_update_button: boolean,
        ok_title: string,
    },
    tracking: {
        enableFirebase: boolean,
        enableTelemetry: boolean,

        enableAptabase: boolean,
        aptabaseProductionKey: string,
        aptabaseIgnores?: string,
        aptabaseRemoveIgnores?: string,
    }
}

export type SubscribedData = {
    id: string,
    tick: number,
}

export type BackgroundForTextCurrent = {
    id: number,
    cat: Category,
    isBold: number,
    sizeBig: number,
    colorText: string | undefined,
}

export type TriviaDifficulty = 'hard' | 'medium' | 'easy' | 'all'

export type TriviaAnswerType = 'multi' | 'truefalse' | 'all'

export type Trivia = {
    question: string,
    answer: string,
    incorrectAnswer: string[]
}

export type Streak = {
    id: string,
    bestStreak: number,
    currentStreak: number,
    lastDateTick: number,
}

export type TopMovie = {
    "rank": number,
    "title": string,
    "desc": string,
    "thumbnailUri": string,
    "info": string,
    "rate": string,
}

export type RandomImage = {
    title?: string,
    uri: string,
}

export type UniversePicOfDayData = {
    title?: string,
    imgUri?: string, // full hd
    thumbUri?: string,
    credit?: string,
    explanation?: string,
}

export type Quote = {
    content: string,
    author: string,
}

export type ShortFilm = {
    "name": string,
    "desc": string,
    "img": string,
    "author": string,
    "url": string,
}

export interface UserInfo {
    userId: string,
    platform: string,
    country: string,
    version: number,
    time: number,
    installedDate: string,
    extra: string,
}

export type FunSound = {
    "mp3": string,
    "name": string,
}

export type FunWebsite = {
    "id": number,
    "url": string,
    "desc": string,
    "img": string,
}

export type PhotosOfTheYear = {
    year: number,
    list: AwardPicture[],
}

export type AwardPicture = {
    "reward": string,
    "category": string,
    "author": string,
    "country": string,
    "imageUri": string,
    "title": string
    "description": string,
}