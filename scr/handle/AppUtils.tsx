import { DirName } from "../constants/AppConstants";
import { Cheat } from "./Cheat";
import { DeleteFileAsync } from "./FileUtils";

/**
 * cheat clear whole folder data
 */
export async function CheckAndClearAllLocalFileBeforeLoadApp() {
    if (!Cheat('IsClearAllLocalFileBeforeLoadApp'))
        return;

    let error = await DeleteFileAsync(DirName.MasterDir, true);

    if (error)
        console.error('CANNOT delete', DirName.MasterDir, 'error:', error);
    else
        console.log('COMPLETELY DELETED all local files!');
}