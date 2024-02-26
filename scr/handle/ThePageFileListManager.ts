import { Category, NeedReloadReason } from "../constants/AppConstants";
import { FileList } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";
import { IsInternetAvailableAsync } from "./NetLord";
import { AlertNoInternet, GetListFileRLP, HandleError } from "./AppUtils";
import { PreventCallDuplicateFunctionHandler } from "./PreventCallDuplicateFunctionHandler";

const cachedFileLists: [Category, FileList][] = []

function Cached(cat: Category, fileList: FileList) {
    const cached = cachedFileLists.find(i => i[0] === cat)

    if (cached === undefined) {
        // console.log('cacheddd', Category[cat]);

        cachedFileLists.push([cat, fileList])
    }
    else {
        // console.log('update cacheddd', Category[cat]);
        cached[1] = fileList
    }
}

function GetCached(cat: Category) {
    const f = cachedFileLists.find(i => i[0] === cat)

    if (f) {
        // console.log('get cacheddd ok', Category[cat]);
        return f[1]
    }
    else
        return undefined
}

const preventCallDuplicateFunctionHandlers: [Category, PreventCallDuplicateFunctionHandler<FileList | NeedReloadReason>][] = []

export async function CheckAndGetFileListAsync(cat: Category): Promise<FileList | NeedReloadReason> {
    const funcPreventByCat = preventCallDuplicateFunctionHandlers.find(i => i[0] === cat)

    let funcPrevent: PreventCallDuplicateFunctionHandler<FileList | NeedReloadReason>

    if (funcPreventByCat) {
        funcPrevent = funcPreventByCat[1]
    }
    else {
        funcPrevent = new PreventCallDuplicateFunctionHandler(async () => await CheckAndGetFileListAsync_Core(cat), 200)

        preventCallDuplicateFunctionHandlers.push([
            cat,
            funcPrevent
        ])
    }

    return await funcPrevent.ExcecuteAsync()
}

async function CheckAndGetFileListAsync_Core(cat: Category): Promise<FileList | NeedReloadReason> {
    // load from cached first

    let fileList: FileList | undefined = GetCached(cat)

    // or load from local

    if (fileList === undefined) {
        const localRLP = GetListFileRLP(cat, true);
        const readLocalRes = await ReadTextAsync(localRLP, true);

        if (typeof readLocalRes.text === 'string') {
            fileList = JSON.parse(readLocalRes.text) as FileList;
        }
    }

    // check if need to download

    const localVersion: number = fileList === undefined ? -1 : fileList.version;
    let needDownload = false;

    if (fileList === undefined)
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
    else if (cat === Category.Awesome && localVersion < versions.awesome)
        needDownload = true;
    else if (cat === Category.Typo && localVersion < versions.typo)
        needDownload = true;
    else if (cat === Category.Sunset && localVersion < versions.sunset)
        needDownload = true;
    else if (cat === Category.Vocabulary && localVersion < versions.vocabulary)
        needDownload = true;
    else if (cat === Category.Info && localVersion < versions.info)
        needDownload = true;
    else if (cat === Category.Tune && localVersion < versions.tune)
        needDownload = true;

    // not need to dl

    if (!needDownload && fileList !== undefined) {
        if (Cheat('IsLog_LoadFileList')) {
            console.log(Category[cat], 'Loaded FileList from local or cached');
        }

        Cached(cat, fileList)
        return fileList;
    }

    // need dl

    if (Cheat('IsLog_LoadFileList')) {
        console.log(Category[cat], 'Loaded FileList from FB');
    }

    const res = await DownloadAndSaveFileListAsync(cat)

    if (typeof res === 'object') {
        Cached(cat, res)
    }

    return res
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