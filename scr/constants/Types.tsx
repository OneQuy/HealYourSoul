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
}

export type SubscribedData = {
    id: string,
    tick: number,
}