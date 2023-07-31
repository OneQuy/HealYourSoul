import { Category, FirebaseDBPath, FirebasePath, LocalPath } from "../constants/AppConstants";
import { FileList, PostMetadata } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync, FirebaseStorage_DownloadAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { DeleteFileAsync, DeleteTempDirAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";

/**
 * cheat clear whole folder data
 */
export async function CheckAndClearAllLocalFileBeforeLoadApp() {
    if (!Cheat('IsClearAllLocalFileBeforeLoadApp'))
        return;

    let error = await DeleteFileAsync(LocalPath.MasterDirName, true);

    if (error)
        console.error('CANNOT delete: ', LocalPath.MasterDirName, ', error:', error);
    else
        console.log('COMPLETELY DELETED ' + LocalPath.MasterDirName);

    error = await DeleteTempDirAsync();

    if (error)
        console.error('CANNOT delete: Temp Dir, error:', error);
    else
        console.log('COMPLETELY DELETED Temp Dir!');
}

export const GetListFileRLP = (cat: Category, localOrFb: boolean) => {
    if (!localOrFb) {
        if (cat === Category.Draw)
            return FirebasePath.ListFile_Draw;
        else if (cat === Category.Real)
            return FirebasePath.ListFile_Real;
        else if (cat === Category.Quote)
            return FirebasePath.ListFile_Quote;
        else
            throw new Error('GetListFileRLP: ' + cat);
    }
    else {
        if (cat === Category.Draw)
            return LocalPath.ListFile_Draw;
        else if (cat === Category.Real)
            return LocalPath.ListFile_Real;
        else if (cat === Category.Quote)
            return LocalPath.ListFile_Quote;
        else
            throw new Error('GetListFileRLP: ' + cat);
    }
}

export const GetDBVersionPath = (cat: Category) => {
    if (cat === Category.Draw)
        return FirebaseDBPath.Version_Draw;
    else if (cat === Category.Real)
        return FirebaseDBPath.Version_Real;
    else if (cat === Category.Quote)
        return FirebaseDBPath.Version_Quote;
    else
        throw new Error('GetDBPath: ' + cat);
}

async function DownloadAndSaveFileListAsync(cat: Category): Promise<FileList> {
    const res = await FirebaseStorage_DownloadAndReadJsonAsync(GetListFileRLP(cat, false), GetListFileRLP(cat, true));

    if (res.error)
        throw new Error(res.error as string);

    return res.json as FileList;
}

export async function CheckAndGetFileListAsync(cat: Category): Promise<FileList> {
    const localRLP = GetListFileRLP(cat, true);
    const readLocalRes = await ReadTextAsync(localRLP, true);
    let localFileList: FileList | null = null;

    if (typeof readLocalRes.text === 'string') {
        localFileList = JSON.parse(readLocalRes.text) as FileList;
    }

    const localVersion: number = localFileList === null ? -1 : localFileList.version;
    let needDownload = false;

    if (cat === Category.Draw && localVersion < versions.draw)
        needDownload = true;
    else if (cat === Category.Quote && localVersion < versions.quote)
        needDownload = true;
    else if (cat === Category.Real && localVersion < versions.real)
        needDownload = true;

    if (!needDownload && localFileList !== null) {
        if (Cheat('IsLog_LoadFileList')) {
            console.log(Category[cat], 'Loaded FileList from local');
        }

        return localFileList;
    }

    if (Cheat('IsLog_LoadFileList')) {
        console.log(Category[cat], 'Loaded FileList from FB');
    }

    return await DownloadAndSaveFileListAsync(cat);
}

const GetMediaFullPath = (localOrFb: boolean, cat: Category, postID: number, mediaIdx: number) => {
    let path;

    if (cat === Category.Draw)
        path = `draw/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Real)
        path = `real/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Quote)
        path = `quote/data/${postID}/${mediaIdx}`;
    else
        throw new Error('GetDataFullPath: ' + cat);

    if (localOrFb) {
        return GetFLPFromRLP(LocalPath.MasterDirName + '/' + path, true)
    }
    else {
        return path;
    }
}

export async function CheckLocalFileAndGetURIAsync(cat: Category, post: PostMetadata, mediaIdx: number): Promise<{uri: string | null, error: any}> {
    const uri = GetMediaFullPath(true, cat, post.id, mediaIdx);

    if (await IsExistedAsync(uri, false)) {
        if (Cheat('IsLog_LoadMedia')) {
            console.log(Category[cat], 'loaded media from LOCAL', 'post: ' + post.id, 'media idx: ' + mediaIdx);
        }

        return {
            uri,
            error: null
        }
    }
    const fbPath = GetMediaFullPath(false, cat, post.id, mediaIdx);

    const res = await FirebaseStorage_DownloadAsync(fbPath, uri, false);

    if (Cheat('IsLog_LoadMedia')) {
        console.log(Category[cat], 'DOWNLOADED media', 'post: ' + post.id, 'media idx: ' + mediaIdx, 'success: ' + (res === null));
    }

    return {
        uri: res ? null : uri,
        error: res
    }
}