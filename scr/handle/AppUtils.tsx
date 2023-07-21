import { Category, FirebasePath, LocalPath } from "../constants/AppConstants";
import { FileList } from "../constants/Types";
import { FirebaseStorage_DownloadAndReadJsonAsync } from "../firebase/FirebaseStorage";
import { Cheat } from "./Cheat";
import { DeleteFileAsync } from "./FileUtils";

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
        console.log('COMPLETELY DELETED all local files!');
}

export const GetListFileRLP = (cat: Category, localOrFb: boolean) => {
    if (localOrFb) {
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

export async function DownloadAndSaveFileList(cat: Category): Promise<FileList> {
    const res = await FirebaseStorage_DownloadAndReadJsonAsync(GetListFileRLP(cat, false), GetListFileRLP(cat, true));

    if (res.error)
        throw new Error(res.error as string);

    return res.json as FileList;
}