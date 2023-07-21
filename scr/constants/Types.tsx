export enum MediaType {
    Image = 0,
    Video = 1
}

export type PostMetadata = {
    title: string,
    author: string,
    url: string,
    media: MediaType[],
}

export type FileList = {
    version: number,
    posts: PostMetadata[]
}