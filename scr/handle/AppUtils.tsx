import { Alert } from "react-native";
import { Category, FirebaseDBPath, FirebasePath, LocalPath, LocalText, NeedReloadReason } from "../constants/AppConstants";
import { ThemeColor } from "../constants/Colors";
import { FileList, MediaType, PostMetadata } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync, FirebaseStorage_DownloadByGetBytesAsync, FirebaseStorage_DownloadByGetURLAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { DeleteFileAsync, DeleteTempDirAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";
import { ToastOptions, toast } from "@baronha/ting";
import { ColorNameToHex, ToCanPrint } from "./UtilsTS";
import { AppLog } from "./AppLog";
import RNFS, { DownloadProgressCallbackResult, ReadDirItem } from "react-native-fs";
import { IsInternetAvailableAsync } from "./NetLord";

const MaxPostsDownloadOnce = 10

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

async function DownloadAndSaveFileListAsync(cat: Category): Promise<FileList | NeedReloadReason> {
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        AlertNoInternet();
        return NeedReloadReason.NoInternet;
    }

    const result = await FirebaseStorage_DownloadAndReadJsonAsync(GetListFileRLP(cat, false), GetListFileRLP(cat, true));

    if (result.error) {
        HandleError('DownloadFileList', result.error)
        return NeedReloadReason.FailToGetContent;
    }

    return result.json as FileList;
}

export async function CheckAndGetFileListAsync(cat: Category): Promise<FileList | NeedReloadReason> {
    const localRLP = GetListFileRLP(cat, true);
    const readLocalRes = await ReadTextAsync(localRLP, true);
    let localFileList: FileList | null = null;

    if (typeof readLocalRes.text === 'string') {
        localFileList = JSON.parse(readLocalRes.text) as FileList;
    }

    const localVersion: number = localFileList === null ? -1 : localFileList.version;
    let needDownload = false;

    if (localFileList === null)
        needDownload = true;
    else if (!versions) { } // offline mode
    else if (cat === Category.Draw && localVersion < versions.draw)
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

const GetMediaFullPath = (localOrFb: boolean, cat: Category, postID: number, mediaIdx: number, mediaType: MediaType) => {
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
        if (mediaType === MediaType.Video)
            path += '.mp4';
        else
            path += '.jpg';
    }

    if (localOrFb) {
        return GetFLPFromRLP(LocalPath.MasterDirName + '/' + path, true)
    }
    else {
        return path;
    }
}

export const GetAllSavedLocalPostIDsListAsync = async (cat: Category) => {
    let path;

    if (cat === Category.Draw)
        path = `draw/data`;
    else if (cat === Category.Real)
        path = `real/data`;
    else if (cat === Category.Quote)
        path = `quote/data`;
    else
        throw new Error('GetDataFullPath: ' + cat);

    path = GetFLPFromRLP(LocalPath.MasterDirName + '/' + path, true);

    try {
        const items: ReadDirItem[] = await RNFS.readDir(path);
        return items.map(i => Number.parseInt(i.name));
    }
    catch
    {
        return undefined;
    }
}

export const HandleError = (methodName: string, error: any, themeForToast?: ThemeColor) => {
    const err = methodName + ' - ' + error;

    Track('error', err);
    AppLog.Log(err);

    if (!themeForToast)
        Alert.alert(LocalText.error, LocalText.cant_get_content + '\n\nError: ' + err)
    else {
        toast({
            title: LocalText.error_toast,
            ...ToastTheme(themeForToast, 'error')
        })
    }
}

async function CheckAndPullBunchMediaAsync(cat: Category, fileList: FileList) {
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        if (Cheat('IsLog_DownloadBunchMedia'))
            console.log('[download bunch media] no internet so can not pull!!!')

        return
    }

    const startTick = Date.now()

    let mediaToPullArr = [];
    let existedAndPassedCount = 0;
    let postToPullCount = 0

    for (let idx = 0; idx <= fileList.posts.length; idx++) {
        const post = fileList.posts[idx]
        const id = post.id;
        let addedToPullList = false;

        for (let mediaIdx = 0; mediaIdx < post.media.length; mediaIdx++) {
            const flp = GetMediaFullPath(true, cat, id, mediaIdx, post.media[mediaIdx])

            if (!await IsExistedAsync(flp, false)) {
                addedToPullList = true

                mediaToPullArr.push({
                    id,
                    flp,
                    mediaIdx,
                    type: post.media[mediaIdx]
                })
            }
            else
                existedAndPassedCount++;
        }

        if (addedToPullList)
            postToPullCount++

        if (postToPullCount >= MaxPostsDownloadOnce)
            break
    }

    if (existedAndPassedCount > 0 && Cheat('IsLog_DownloadBunchMedia'))
        console.log('[download bunch media] existed and passed count:', existedAndPassedCount);

    let resArr;

    if (mediaToPullArr.length > 0) {

        if (Cheat('IsLog_DownloadBunchMedia')) {
            console.log('[download bunch media] start pull, total files need to pull', mediaToPullArr.length, ', list id:');
            console.log(mediaToPullArr.map(item => item.id));
        }

        resArr = await Promise.all(
            mediaToPullArr.map(item => {
                const fbPath = GetMediaFullPath(false, cat, item.id, item.mediaIdx, item.type)
                return FirebaseStorage_DownloadByGetBytesAsync(fbPath, item.flp, false)
            })
        )

        resArr.forEach(res => {
            if (res === null)
                return

            // @ts-ignore
            console.error('[download bunch media]', res._baseMessage ?? res);
        })
    }

    const sumTime = Date.now() - startTick
    const totalFile = resArr ? resArr.filter(res => res === null).length : 0

    if (Cheat('IsLog_DownloadBunchMedia'))
        console.log('[download bunch media] done!!! total file downloaded', totalFile, 'time', sumTime);

    toast({
        title: 'Pulled all media, files: ' + totalFile + ', time:' + sumTime
    })
}

async function DownloadMedia(cat: Category, post: PostMetadata, mediaIdx: number, uri: string, progress: (p: DownloadProgressCallbackResult) => void): Promise<string | NeedReloadReason> {
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        AlertNoInternet();
        return NeedReloadReason.NoInternet;
    }

    const fbPath = GetMediaFullPath(false, cat, post.id, mediaIdx, post.media[mediaIdx]);

    const error = await FirebaseStorage_DownloadByGetURLAsync(fbPath, uri, false, progress);

    if (Cheat('IsLog_LoadMedia')) {
        console.log(Category[cat], 'Tried DOWNLOADED media', 'post: ' + post.id, 'media idx: ' + mediaIdx, 'success: ' + (error === null));
    }

    if (error) { // error
        const e = `Cat: ${Category[cat]}, PostID: ${post.id}, Idx: ${mediaIdx}, ` + (error.code ?? ToCanPrint(error));
        HandleError('DownloadMedia', e)
        return NeedReloadReason.FailToGetContent;
    }

    return uri;
}

export async function CheckLocalFileAndGetURIAsync(cat: Category, post: PostMetadata, mediaIdx: number, fileList: FileList, progress: (p: DownloadProgressCallbackResult) => void): Promise<string | NeedReloadReason> {
    // check local 

    const uri = GetMediaFullPath(true, cat, post.id, mediaIdx, post.media[mediaIdx]);

    if (await IsExistedAsync(uri, false)) {
        if (Cheat('IsLog_LoadMedia')) {
            console.log(Category[cat], 'loaded media from LOCAL', 'post: ' + post.id, 'media idx: ' + mediaIdx);
        }

        return uri;
    }

    // need to download, download a bunch first

    await CheckAndPullBunchMediaAsync(cat, fileList)

    // check local again

    if (await IsExistedAsync(uri, false)) {
        if (Cheat('IsLog_LoadMedia')) {
            console.log(Category[cat], 'loaded media from LOCAL', 'post: ' + post.id, 'media idx: ' + mediaIdx);
        }

        return uri;
    }

    // check dl for sure

    return await DownloadMedia(cat, post, mediaIdx, uri, progress);
}

export function ToastTheme(theme: ThemeColor, preset: ToastOptions['preset']) {
    return {
        backgroundColor: preset === 'error' ? ColorNameToHex('tomato') : theme.primary,
        titleColor: preset === 'error' ? ColorNameToHex('white') : theme.counterPrimary,
        messageColor: preset === 'error' ? ColorNameToHex('white') : theme.counterPrimary,
        preset
    }
}

export const AlertNoInternet = () => {
    Alert.alert(
        LocalText.popup_title_need_internet,
        LocalText.popup_content_need_internet,
    );
}

export const Track = (event: string, data?: string) => {
    // todo
    // Track('error', JSON.stringify(result.error));
}