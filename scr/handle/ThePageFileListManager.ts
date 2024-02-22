import { Category, NeedReloadReason } from "../constants/AppConstants";
import { FileList } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { ReadTextAsync } from "./FileUtils";
import { versions } from "./VersionsHandler";
import { IsInternetAvailableAsync } from "./NetLord";
import { AlertNoInternet, GetListFileRLP, HandleError } from "./AppUtils";

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