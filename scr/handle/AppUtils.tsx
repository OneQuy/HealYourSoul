import { Alert, Linking, Platform } from "react-native";
import { Category, FirebaseDBPath, FirebasePath, Icon, LocalPath, LocalText, NeedReloadReason, ScreenName, StorageKey_LastTimeCheckFirstOpenAppOfTheDay } from "../constants/AppConstants";
import { ThemeColor } from "../constants/Colors";
import { FileList, MediaType, PostMetadata } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { DeleteFileAsync, DeleteTempDirAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";
import { ToastOptions, toast } from "@baronha/ting";
import { ColorNameToHex, IsToday, ToCanPrint, VersionToNumber } from "./UtilsTS";
import { AppLog } from "./AppLog";
import RNFS, { DownloadProgressCallbackResult, ReadDirItem } from "react-native-fs";
import { IsInternetAvailableAsync } from "./NetLord";
import Clipboard from "@react-native-clipboard/clipboard";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckDuplicateAndDownloadAsync } from "../firebase/FirebaseStorageDownloadManager";
import { track_FirstOpenOfTheDayAsync, track_HandleError, track_OnUseEffectOnceEnterAppAsync } from "./tracking/GoodayTracking";
import { GetDateAsync, SetDateAsync, SetDateAsync_Now } from "./AsyncStorageUtils";

const today = new Date()
export const todayString = 'd' + today.getDate() + '_m' + (today.getMonth() + 1) + '_' + today.getFullYear()

export const versionText = require('../../package.json')['version']
export const versionAsNumber = VersionToNumber(versionText)

const postPredownloadLimit = 10

const startFreshlyOpenAppTick = Date.now()

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

export const FillPathPattern = (pattern: string, cat: Category, postID: number | string) => {
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

export const HandleError = (methodName: string, error: any, keepSilentForUser?: boolean) => {
    const err = methodName + ' - ' + error;

    track_HandleError(methodName, error)
    AppLog.Log(err);

    if (keepSilentForUser === true)
        return

    toast({
        title: LocalText.error_toast,
        ...ToastTheme_Error()
    })
}

export function OpenStore() {
    const link = Platform.OS === 'android' ?
        "market://details?id=com.healyoursoul" :
        "https://apps.apple.com/us/app/gooday-make-your-day/id6471367879"

    Linking.openURL(link)
}

export async function PreDownloadPosts(
    cat: Category,
    seenIDs: (string | number)[],
    currentPost: PostMetadata | null,
    fileList: FileList) {
    if (!currentPost)
        return

    let count = 0

    for (let ipost = 0; ipost < fileList.posts.length; ipost++) {
        const post = fileList.posts[ipost]
        const postID = post.id

        if (seenIDs.includes(postID))
            continue

        if (Math.abs(currentPost.id - postID) > postPredownloadLimit)
            break

        // need to predownload

        let postHasDownload = false

        for (let imedia = 0; imedia < post.media.length; imedia++) {
            const uri = GetMediaFullPath(true, cat, post.id, imedia, post.media[imedia]);

            if (await IsExistedAsync(uri, false)) {
                continue
            }

            postHasDownload = true
            const fbPath = GetMediaFullPath(false, cat, post.id, imedia, post.media[imedia]);

            CheckDuplicateAndDownloadAsync(fbPath, uri, false)
        }

        if (postHasDownload)
            count++

        if (count > postPredownloadLimit)
            break
    }
}

async function DownloadMedia(cat: Category, post: PostMetadata, mediaIdx: number, uri: string, progress: (p: DownloadProgressCallbackResult) => void): Promise<string | NeedReloadReason> {
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        AlertNoInternet();
        return NeedReloadReason.NoInternet;
    }

    const fbPath = GetMediaFullPath(false, cat, post.id, mediaIdx, post.media[mediaIdx]);

    // const error = await FirebaseStorage_DownloadByGetURLAsync(fbPath, uri, false, progress);
    const error = await CheckDuplicateAndDownloadAsync(fbPath, uri, false, progress)

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

export function ToastTheme(theme: ThemeColor, preset: ToastOptions['preset']): ToastOptions {
    return {
        backgroundColor: theme.primary,
        titleColor: theme.counterPrimary,
        messageColor: theme.counterPrimary,
        preset
    }
}

export function ToastTheme_Error(): ToastOptions {
    return {
        backgroundColor: ColorNameToHex('tomato'),
        titleColor: ColorNameToHex('white'),
        messageColor: ColorNameToHex('white'),
        preset: 'error'
    }
}

export const AlertNoInternet = () => {
    Alert.alert(
        LocalText.popup_title_need_internet,
        LocalText.popup_content_need_internet,
    );
}

export const GetIconOfScreen = (screen: ScreenName) => {
    if (screen === ScreenName.Meme)
        return 'emoticon-poop'
    else if (screen === ScreenName.Comic)
        return 'fire'
    else if (screen === ScreenName.CatDog)
        return 'dog-side'
    else if (screen === ScreenName.NSFW)
        return 'emoticon-devil'
    else if (screen === ScreenName.Quote)
        return 'human-handsup'
    else if (screen === ScreenName.Satisfying)
        return 'head-heart'
    else if (screen === ScreenName.Love)
        return 'cards-heart'
    else if (screen === ScreenName.Sarcasm)
        return 'duck'
    else if (screen === ScreenName.Cute)
        return 'assistant'
    else if (screen === ScreenName.Art)
        return 'palette'
    else if (screen === ScreenName.Trivia)
        return 'message-question'
    else if (screen === ScreenName.ShortFact)
        return 'newspaper-variant'
    else if (screen === ScreenName.Joke)
        return 'dolphin'
    else if (screen === ScreenName.Picture)
        return 'file-image'
    else if (screen === ScreenName.QuoteText)
        return 'format-quote-open'
    else if (screen === ScreenName.AwardPicture)
        return 'crown'
    else if (screen === ScreenName.WikiFact)
        return 'book-open-variant'
    else if (screen === ScreenName.FunWebsite)
        return 'web'
    else if (screen === ScreenName.TopMovie)
        return 'movie-open'
    else if (screen === ScreenName.BestShortFilms)
        return 'video-vintage'
    else if (screen === ScreenName.RandomMeme)
        return 'emoticon-lol'
    else
        return Icon.HeartBroken
}

export const IsContentScreen = (screen: ScreenName) => {
    const notContentScreen: ScreenName[] = [
        ScreenName.IAPPage,
        ScreenName.Setting
    ]

    return !notContentScreen.includes(screen)
}

export const SaveCurrentScreenForLoadNextTime = (navigation: NavigationProp<ReactNavigation.RootParamList>) => {
    const state = navigation.getState();
    const screenName = state.routeNames[state.index];
    AsyncStorage.setItem('categoryScreenToOpenFirst', screenName);
}

const GetApiDataItemFromCached = async <T extends (string | {})>(key: string): Promise<T | undefined> => {
    const cachedItemArr = await AsyncStorage.getItem(key)

    if (!cachedItemArr)
        return undefined

    const arr = JSON.parse(cachedItemArr) as T[]

    if (!arr || arr.length <= 0)
        return undefined

    const item = arr[0]

    const subArr = arr.slice(1)
    await AsyncStorage.setItem(key, JSON.stringify(subArr))

    return item
}

/**
 * on freshly open app or first active of the day
 */
export const CheckAndTriggerFirstOpenAppOfTheDayAsync = async () => {
    const lastDateTrack = await GetDateAsync(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

    if (lastDateTrack !== undefined && IsToday(lastDateTrack))
        return

    SetDateAsync_Now(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

    // handles

    console.log('---- handle first open app of the day ------');

    track_FirstOpenOfTheDayAsync()
}

/**
 * freshly open app
 */
export const OnUseEffectOnceEnterApp = () => {
    track_OnUseEffectOnceEnterAppAsync(startFreshlyOpenAppTick)
    CheckAndTriggerFirstOpenAppOfTheDayAsync()
}