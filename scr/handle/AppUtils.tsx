import { Alert, Share as RNShare, Linking, Platform, ShareContent } from "react-native";
import { Category, FirebaseDBPath, FirebasePath, Icon, LocalPath, LocalText, NeedReloadReason, ScreenName, StorageKey_FirstTimeInstallTick, StorageKey_ItemCountCat, StorageKey_LastTrackCountryName, StorageKey_Rated, StorageKey_ScreenToInit, shareAppText } from "../constants/AppConstants";
import { GetColors, ThemeColor } from "../constants/Colors";
import { FileList, MediaType, PostMetadata, UserInfo } from "../constants/Types";
import { Cheat } from "./Cheat";
import { DeleteFileAsync, DeleteTempDirAsync, GetFLPFromRLP, IsExistedAsync } from "./FileUtils";
import { ToastOptions, toast } from "@baronha/ting";
import { ColorNameToHex, SafeDateString, ToCanPrint, VersionToNumber } from "./UtilsTS";
import RNFS, { DownloadProgressCallbackResult, ReadDirItem } from "react-native-fs";
import { IsInternetAvailableAsync } from "./NetLord";
import Clipboard from "@react-native-clipboard/clipboard";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckDuplicateAndDownloadAsync } from "../firebase/FirebaseStorageDownloadManager";
import { track_HandleError, track_Simple, track_SimpleWithParam } from "./tracking/GoodayTracking";
import { GetBooleanAsync, GetDateAsync, GetNumberIntAsync, SetBooleanAsync, SetNumberAsync } from "./AsyncStorageUtils";
import { CheckAndShowInAppReviewAsync } from "./InAppReview";
import { UserID } from "./UserID";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../navigation/Navigator";

const today = new Date()
export const todayString = 'd' + today.getDate() + '_m' + (today.getMonth() + 1) + '_' + today.getFullYear()

export const versionText = require('../../package.json')['version']
export const versionAsNumber = VersionToNumber(versionText)

const postPredownloadLimit = 10

export const startFreshlyOpenAppTick = Date.now()

const pairCatAndScreenName: [Category, ScreenName][] = [
    [Category.Draw, ScreenName.Comic],
    [Category.Meme, ScreenName.Meme],
    [Category.Quote, ScreenName.Quote],
    [Category.CatDog, ScreenName.CatDog],
    [Category.Love, ScreenName.Love],
    [Category.Satisfying, ScreenName.Satisfying],
    [Category.NSFW, ScreenName.NSFW],
    [Category.Cute, ScreenName.Cute],
    [Category.Sarcasm, ScreenName.Sarcasm],
    [Category.Art, ScreenName.Art],
    [Category.NinjaFact, ScreenName.ShortFact],
    [Category.Picture, ScreenName.Picture],
    [Category.NinjaJoke, ScreenName.Joke],
    [Category.Trivia, ScreenName.Trivia],
    [Category.Quotetext, ScreenName.QuoteText],
    [Category.AwardPicture, ScreenName.AwardPicture],
    [Category.Wikipedia, ScreenName.WikiFact],
    [Category.FunWebsites, ScreenName.FunWebsite],
    [Category.TopMovie, ScreenName.TopMovie],
    [Category.BestShortFilms, ScreenName.BestShortFilms],
    [Category.RandomMeme, ScreenName.RandomMeme],
    [Category.Awesome, ScreenName.Awesome],
    [Category.Typo, ScreenName.Typo],
    [Category.Info, ScreenName.Info],
    [Category.Sunset, ScreenName.Sunset],
    [Category.FunSound, ScreenName.FunSound],
    [Category.Tune, ScreenName.Tune],
    [Category.Vocabulary, ScreenName.Vocabulary],
] as const

const notContentScreen: ScreenName[] = [
    ScreenName.IAPPage,
    ScreenName.Setting,
    ScreenName.Upload,
    ScreenName.Saved
] as const

var appUtilsTheme: ThemeColor = GetColors('default_dark')

export const setAppUtilsTheme = (th: ThemeColor) => appUtilsTheme = th

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
        if (cat === Category.Tune)
            return FirebasePath.ListFile_Tune;
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
        else if (cat === Category.Sunset)
            return FirebasePath.ListFile_Sunset;
        else if (cat === Category.Vocabulary)
            return FirebasePath.ListFile_Vocabulary;
        else if (cat === Category.Typo)
            return FirebasePath.ListFile_Typo;
        else if (cat === Category.Info)
            return FirebasePath.ListFile_Info;
        else if (cat === Category.Awesome)
            return FirebasePath.ListFile_Awesome;
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
        else if (cat === Category.Typo)
            return LocalPath.ListFile_Typo;
        else if (cat === Category.Info)
            return LocalPath.ListFile_Info;
        else if (cat === Category.Awesome)
            return LocalPath.ListFile_Awesome;
        else if (cat === Category.Sunset)
            return LocalPath.ListFile_Sunset;
        else if (cat === Category.Vocabulary)
            return LocalPath.ListFile_Vocabulary;
        else if (cat === Category.Tune)
            return LocalPath.ListFile_Tune;
        else
            throw new Error('GetListFileRLP: ' + cat);
    }
}

export const CatToScreenName = (cat: Category): ScreenName | undefined => {
    const f = pairCatAndScreenName.find(i => i[0] === cat)

    if (f)
        return f[1]
    else
        return undefined
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
    else if (cat === Category.Sunset)
        return FirebaseDBPath.Version_Sunset;
    else if (cat === Category.Vocabulary)
        return FirebaseDBPath.Version_Vocabulary;
    else if (cat === Category.Typo)
        return FirebaseDBPath.Version_Typo;
    else if (cat === Category.Info)
        return FirebaseDBPath.Version_Info;
    else if (cat === Category.Awesome)
        return FirebaseDBPath.Version_Awesome;
    else if (cat === Category.Tune)
        return FirebaseDBPath.Version_Tune;
    else
        throw new Error('GetDBPath: ' + cat);
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
    else if (cat === Category.Typo)
        path = `typo/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Info)
        path = `info/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Awesome)
        path = `awesome/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Sunset)
        path = `sunset/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Vocabulary)
        path = `vocabulary/data/${postID}/${mediaIdx}`;
    else if (cat === Category.Tune)
        path = `tune/data/${postID}/${mediaIdx}`;
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
    else if (cat === Category.Awesome)
        path = `awesome/data`;
    else if (cat === Category.Tune)
        path = `tune/data`;
    else if (cat === Category.Typo)
        path = `typo/data`;
    else if (cat === Category.Info)
        path = `info/data`;
    else if (cat === Category.Sunset)
        path = `sunset/data`;
    else if (cat === Category.Vocabulary)
        path = `vocabulary/data`;
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

export const ShareApp = async () => {
    track_Simple('share_app')

    RNShare.share({
        title: 'Gooday',
        message: shareAppText,
    } as ShareContent)
}

export const RateApp = async () => {
    const res = await CheckAndShowInAppReviewAsync()

    track_SimpleWithParam('rated', res === true ? 'true' : 'false')

    console.log('rated result: ' + ToCanPrint(res));

    if (res === true) // success
    {
        if (Platform.OS === 'ios')
            return

        const ratedBefore = await GetBooleanAsync(StorageKey_Rated)

        if (!ratedBefore) {
            SetBooleanAsync(StorageKey_Rated, true)
            return
        }
    }

    // fail

    OpenStore()

    if (typeof res !== 'boolean') {
        HandleError('RateApp', ToCanPrint(res), true)
    }
}

export const GoodayToast = (s: string) => {
    const options: ToastOptions = {
        title: s,
        ...ToastTheme(appUtilsTheme, 'done')
    };

    toast(options);
}

export const CopyAndToast = (s: string, theme: ThemeColor) => {
    Clipboard.setString(s);

    const options: ToastOptions = {
        title: LocalText.copied,
        ...ToastTheme(theme, 'done')
    };

    toast(options);
}

export const CreateUserInfoObjectAsync = async (extra: string): Promise<UserInfo> => {
    let installedDate = ''

    const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

    if (firstTimeInstallTick !== undefined) {
        installedDate = SafeDateString(firstTimeInstallTick, '_')
    }

    let lastTrackCountry = await AsyncStorage.getItem(StorageKey_LastTrackCountryName)

    return {
        userId: UserID(),
        platform: Platform.OS,
        country: lastTrackCountry,
        version: versionAsNumber,
        time: Date.now(),
        installedDate,
        extra,
    } as UserInfo
}

/**
 * 
 * @returns true if have new items
 */
export const ToastNewItemsAsync = async (cat: Category, text: string, list: any[], theme: ThemeColor): Promise<boolean> => {
    const lastCount = await GetNumberIntAsync(StorageKey_ItemCountCat(cat))
    SetNumberAsync(StorageKey_ItemCountCat(cat), list.length)

    if (Number.isNaN(lastCount))
        return false

    const newItemCount = list.length - lastCount

    if (newItemCount <= 0)
        return false

    text = text.replace('#', newItemCount.toString())

    const options: ToastOptions = {
        title: text,
        ...ToastTheme(theme, 'done')
    };

    toast(options)

    return true
}

/**
 * can call whenever needed, even splashscreen (after init IsDev())
 */
export const HandleError = (methodName: string, error: any, keepSilentForUser?: boolean) => {
    track_HandleError(methodName, error)

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

        if (seenIDs && seenIDs.includes(postID))
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

export async function CheckLocalFileAndGetURIAsync(cat: Category, post: PostMetadata, mediaIdx: number, progress: (p: DownloadProgressCallbackResult) => void): Promise<string | NeedReloadReason> {
    // check local 

    const uri = GetMediaFullPath(true, cat, post.id, mediaIdx, post.media[mediaIdx]);

    if (await IsExistedAsync(uri, false)) {
        if (Cheat('IsLog_LoadMedia')) {
            console.log(Category[cat], 'loaded media from LOCAL', 'post: ' + post.id, 'media idx: ' + mediaIdx);
        }

        return uri;
    }

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
    if (screen === ScreenName.FunSound)
        return 'volume-high'
    else if (screen === ScreenName.Meme)
        return 'emoticon-poop'
    else if (screen === ScreenName.Vocabulary)
        return 'translate'
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
    else if (screen === ScreenName.Awesome)
        return 'star-shooting'
    else if (screen === ScreenName.Sunset)
        return 'weather-sunset'
    else if (screen === ScreenName.Typo)
        return 'format-letter-ends-with'
    else if (screen === ScreenName.Info)
        return 'information'
    else if (screen === ScreenName.Tune)
        return 'music-note'
    else
        return Icon.HeartBroken
}

export const GetAllContentScreens = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>,
    disableScreens?: ScreenName[],
): ScreenName[] => {
    const routes = navigation.getState().routes.filter(i => {
        const name = i.name as ScreenName

        return IsContentScreen(name) &&
            (!disableScreens || !disableScreens.includes(name))
    })

    return routes.map(i => i.name)
}

export const IsContentScreen = (screen: ScreenName) => {
    return !notContentScreen.includes(screen)
}

export const SaveCurrentScreenForLoadNextTime = (navigation: NavigationProp<ReactNavigation.RootParamList> | DrawerNavigationProp<DrawerParamList>) => {
    const state = navigation.getState();
    const screenName = state.routeNames[state.index];
    AsyncStorage.setItem(StorageKey_ScreenToInit, screenName);
}

export const GetApiDataItemFromCached = async <T extends (string | {})>(key: string): Promise<T | undefined> => {
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