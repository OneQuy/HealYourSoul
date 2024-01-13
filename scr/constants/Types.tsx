import { Category } from "./AppConstants"

export enum MediaType {
    Image = 0,
    Video = 1
}

export type PostMetadata = {
    id: number,
    title: string,
    author: string,
    url: string,
    media: MediaType[],
}

export type FileList = {
    version: number,
    posts: PostMetadata[]
}

export type LatestVersionConfig = {
    version: number,
    force_update: boolean,
    release_note: string,
}

export type AppConfig = {
    net_url: string,
    remote_files: object,
    force_dev: boolean,
    latest_version: {
        android: LatestVersionConfig,
        ios: LatestVersionConfig,
    },
    notice?: {
        max_version: number,
        content: string,
        link: string,
        is_press_to_open_store: boolean,
        color: string,
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
    }
}

export type SubscribedData = {
    id: string,
    tick: number,
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
    uniquePostSeen: number,
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

export type ShortFilm = {
    "name": string,
    "desc": string,
    "img": string,
    "author": string,
    "url": string,
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