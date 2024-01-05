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

export type AppConfig = {
    ios_review_limit_version: string,
    net_url: string,
    remote_files: object,
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