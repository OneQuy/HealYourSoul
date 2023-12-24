import { Alert, Platform } from "react-native";
import { Category, FirebaseDBPath, FirebasePath, LocalPath, LocalText, NeedReloadReason } from "../constants/AppConstants";
import { ThemeColor } from "../constants/Colors";
import { FileList, MediaType, PostMetadata } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync, FirebaseStorage_DownloadByGetURLAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { DeleteFileAsync, DeleteTempDirAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";
import { ToastOptions, toast } from "@baronha/ting";
import { ColorNameToHex, ToCanPrint, VersionToNumber } from "./UtilsTS";
import { AppLog } from "./AppLog";
import RNFS, { DownloadProgressCallbackResult, ReadDirItem } from "react-native-fs";
import { IsInternetAvailableAsync } from "./NetLord";
import { GetAppConfig } from "./AppConfigHandler";
import Clipboard from "@react-native-clipboard/clipboard";

const today = new Date()
const todayString = 'd' + today.getDate() + '_m' + (today.getMonth() + 1) + '_' + today.getFullYear()

const version = require('../../package.json')['version']
const versionToNum = VersionToNumber(version)

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

export const GetExpiredDateAndDaysLeft = (startDayTick: number, month: number, endIsValidOrExpired: boolean = false): [Date, number] => {
    const subDate = new Date(startDayTick)

    const expiredDate = new Date(startDayTick)
    expiredDate.setMonth(subDate.getMonth() + month)
    expiredDate.setDate(expiredDate.getDate() + (endIsValidOrExpired ? 0 : 1))

    const dayLeft = Math.ceil((expiredDate.valueOf() - Date.now()) / 1000 / 3600 / 24)

    return [expiredDate, dayLeft]
}

export const FillPathPattern = (pattern: string, cat: Category, postID: number) => {
    return pattern.replace('@id', postID.toString()).replace('@cat', Category[cat])
}

export const GetListFileRLP = (cat: Category, localOrFb: boolean) => {
    if (!localOrFb) {
        if (cat === Category.Draw)
            return FirebasePath.ListFile_Draw;
        else if (cat === Category.Meme)
            return FirebasePath.ListFile_Meme;
        else if (cat === Category.Quote)
            return FirebasePath.ListFile_Quote;
        else if (cat === Category.Love)
            return FirebasePath.ListFile_Love;
        else if (cat === Category.CatDog)
            return FirebasePath.ListFile_CatDog;
        else if (cat === Category.Satisfying)
            return FirebasePath.ListFile_Satisfying;
        else if (cat === Category.NSFW)
            return FirebasePath.ListFile_NSFW;
        else if (cat === Category.Art)
            return FirebasePath.ListFile_Art;
        else if (cat === Category.Cute)
            return FirebasePath.ListFile_Cute;
        else if (cat === Category.Sarcasm)
            return FirebasePath.ListFile_Sarcasm;
        else
            throw new Error('GetListFileRLP: ' + cat);
    }
    else {
        if (cat === Category.Draw)
            return LocalPath.ListFile_Draw;
        else if (cat === Category.Meme)
            return LocalPath.ListFile_Meme;
        else if (cat === Category.Quote)
            return LocalPath.ListFile_Quote;
        else if (cat === Category.Satisfying)
            return LocalPath.ListFile_Satisfying;
        else if (cat === Category.Love)
            return LocalPath.ListFile_Love;
        else if (cat === Category.CatDog)
            return LocalPath.ListFile_CatDog;
        else if (cat === Category.NSFW)
            return LocalPath.ListFile_NSFW;
        else if (cat === Category.Art)
            return LocalPath.ListFile_Art;
        else if (cat === Category.Cute)
            return LocalPath.ListFile_Cute;
        else if (cat === Category.Sarcasm)
            return LocalPath.ListFile_Sarcasm;
        else
            throw new Error('GetListFileRLP: ' + cat);
    }
}

export const GetDBVersionPath = (cat: Category) => {
    if (cat === Category.Draw)
        return FirebaseDBPath.Version_Draw;
    else if (cat === Category.Meme)
        return FirebaseDBPath.Version_Meme;
    else if (cat === Category.Quote)
        return FirebaseDBPath.Version_Quote;
    else if (cat === Category.CatDog)
        return FirebaseDBPath.Version_CatDog;
    else if (cat === Category.Love)
        return FirebaseDBPath.Version_Love;
    else if (cat === Category.Satisfying)
        return FirebaseDBPath.Version_Satisfying;
    else if (cat === Category.NSFW)
        return FirebaseDBPath.Version_NSFW;
    else if (cat === Category.Art)
        return FirebaseDBPath.Version_Art;
    else if (cat === Category.Cute)
        return FirebaseDBPath.Version_Cute;
    else if (cat === Category.Sarcasm)
        return FirebaseDBPath.Version_Sarcasm;
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
    else if (cat === Category.Meme && localVersion < versions.meme)
        needDownload = true;
    else if (cat === Category.Love && localVersion < versions.love)
        needDownload = true;
    else if (cat === Category.CatDog && localVersion < versions.catdog)
        needDownload = true;
    else if (cat === Category.Satisfying && localVersion < versions.satisfying)
        needDownload = true;
    else if (cat === Category.NSFW && localVersion < versions.nsfw)
        needDownload = true;
    else if (cat === Category.Cute && localVersion < versions.cute)
        needDownload = true;
    else if (cat === Category.Art && localVersion < versions.art)
        needDownload = true;
    else if (cat === Category.Sarcasm && localVersion < versions.sarcasm)
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
    else if (cat === Category.Meme)
        path = `meme/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Quote)
        path = `quote/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Love)
        path = `love/data/${postID}/${mediaIdx}`;
    else if (cat === Category.CatDog)
        path = `catdog/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Satisfying)
        path = `satisfying/data/${postID}/${mediaIdx}`;
    else if (cat === Category.NSFW)
        path = `nsfw/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Cute)
        path = `cute/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Art)
        path = `art/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Sarcasm)
        path = `sarcasm/data/${postID}/${mediaIdx}`;
    else
        throw new Error('GetDataFullPath: ' + cat);

    if (localOrFb) {
        if (mediaType === MediaType.Video)
            path += '.mp4';
        else
            path += '.jpg';

        return GetFLPFromRLP(LocalPath.MasterDirName + '/' + path, true)
    }
    else
        return path
}

export const GetAllSavedLocalPostIDsListAsync = async (cat: Category) => {
    let path;

    if (cat === Category.Draw)
        path = `draw/data`;
    else if (cat === Category.Meme)
        path = `meme/data`;
    else if (cat === Category.Quote)
        path = `quote/data`;
    else if (cat === Category.Love)
        path = `love/data`;
    else if (cat === Category.Satisfying)
        path = `satisfying/data`;
    else if (cat === Category.CatDog)
        path = `catdog/data`;
    else if (cat === Category.NSFW)
        path = `nsfw/data`;
    else if (cat === Category.Cute)
        path = `cute/data`;
    else if (cat === Category.Sarcasm)
        path = `sarcasm/data`;
    else if (cat === Category.Art)
        path = `art/data`;
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

export const CopyAndToast = (s: string, theme: ThemeColor) => {
    Clipboard.setString(s);

    const options: ToastOptions = {
        title: LocalText.copied,
        ...ToastTheme(theme, 'done')
    };

    toast(options);
}

export const HandleError = (methodName: string, error: any, themeForToast?: ThemeColor, keepSilentForUser?: boolean) => {
    const err = methodName + ' - ' + error;

    Track('error', err);
    AppLog.Log(err);

    if (keepSilentForUser === true)
        return

    if (!themeForToast)
        Alert.alert(LocalText.error, LocalText.cant_get_content + '\n\nError: ' + err)
    else {
        toast({
            title: LocalText.error_toast,
            ...ToastTheme(themeForToast, 'error')
        })
    }
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

    // // need to download, download a bunch first

    // await CheckAndPullBunchMediaAsync(cat, fileList)

    // // check local again

    // if (await IsExistedAsync(uri, false)) {
    //     if (Cheat('IsLog_LoadMedia')) {
    //         console.log(Category[cat], 'loaded media from LOCAL', 'post: ' + post.id, 'media idx: ' + mediaIdx);
    //     }

    //     return uri;
    // }

    // dl for sure

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

export const Is_IOS_And_OfflineOrLowerReviewVersion = () => {
    if (Platform.OS === 'android')
        return false

    const appConfig = GetAppConfig()

    if (!appConfig)
        return true

    const iosReviewVersion = VersionToNumber(appConfig.ios_review_limit_version)

    return versionToNum <= iosReviewVersion
}

export const Track = (event: string, data?: string) => {
    // todo
    // Track('error', JSON.stringify(result.error));
}

// async function CheckAndPullBunchMediaAsync(cat: Category, fileList: FileList) {
//     const isInternet = await IsInternetAvailableAsync();
//     console.log('MaxPostsDownloadOnce', MaxPostsDownloadOnce);

//     if (!isInternet) {
//         if (Cheat('IsLog_DownloadBunchMedia'))
//             console.log('[download bunch media] no internet so can not pull!!!')

//         return
//     }

//     const startTick = Date.now()

//     let mediaToPullArr = [];
//     let existedAndPassedCount = 0;
//     let postToPullCount = 0

//     for (let idx = 0; idx <= fileList.posts.length; idx++) {
//         const post = fileList.posts[idx]
//         const id = post.id;
//         let addedToPullList = false;

//         //todo
//         // for (let mediaIdx = 0; mediaIdx < post.media.length; mediaIdx++) {
//         for (let mediaIdx = 0; mediaIdx < 1; mediaIdx++) {
//             const flp = GetMediaFullPath(true, cat, id, mediaIdx, post.media[mediaIdx])

//             if (!await IsExistedAsync(flp, false)) {
//                 addedToPullList = true

//                 mediaToPullArr.push({
//                     id,
//                     flp,
//                     mediaIdx,
//                     type: post.media[mediaIdx]
//                 })
//             }
//             else
//                 existedAndPassedCount++;
//         }

//         if (addedToPullList)
//             postToPullCount++

//         if (postToPullCount >= MaxPostsDownloadOnce)
//             break
//     }

//     if (existedAndPassedCount > 0 && Cheat('IsLog_DownloadBunchMedia'))
//         console.log('[download bunch media] existed and passed count:', existedAndPassedCount);

//     let resArr;

//     if (mediaToPullArr.length > 0) {

//         if (Cheat('IsLog_DownloadBunchMedia')) {
//             console.log('[download bunch media] start pull, total files need to pull', mediaToPullArr.length, ', list id:');
//             console.log(mediaToPullArr.map(item => item.id));
//         }

//         resArr = await Promise.all(
//             mediaToPullArr.map(item => {
//                 const fbPath = GetMediaFullPath(false, cat, item.id, item.mediaIdx, item.type)
//                 return FirebaseStorage_DownloadByGetBytesAsync(fbPath, item.flp, false)
//             })
//         )

//         resArr.forEach(res => {
//             if (res === null)
//                 return

//             // @ts-ignore
//             console.error('[download bunch media]', res._baseMessage ?? res);
//         })
//     }

//     const sumTime = Date.now() - startTick
//     const totalFile = resArr ? resArr.filter(res => res === null).length : 0

//     if (Cheat('IsLog_DownloadBunchMedia'))
//         console.log('[download bunch media] done!!! total file downloaded', totalFile, 'time', sumTime);

//     toast({
//         title: 'Pulled all media, files: ' + totalFile + ', time:' + sumTime
//     })
// }