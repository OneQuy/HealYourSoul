import { toast } from "@baronha/ting";
import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { IsInternetAvailableAsync, ToastTheme, Track } from "./AppUtils";
import { Cheat } from "./Cheat";
import { LocalText } from "../constants/AppConstants";
import { ThemeColor } from "../constants/Colors";
import { AppLog } from "./AppLog";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    draw: number,
    quote: number,
    real: number
}

export var versions: Versions;

export async function HandleVersionsFileAsync(theme: ThemeColor) {
    let time = new Date();
   
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        toast({
            title: LocalText.offline_mode,            
            ...ToastTheme(theme, 'none')
        })

        return;
    }

    const result = await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath);

    // fail

    if (result.error) {
        const err = 'HandleVersionsFileAsync - ' + JSON.stringify(result.error);
        
        console.error(err);
        Track('error', err);
        AppLog.Log(err);

        toast({
            title: LocalText.error_toast,
            ...ToastTheme(theme, 'error')
        })
        return;
    }

    // success

    versions = result.value as Versions;

    if (Cheat('IsLog_TimeVersion')) {
        let now = new Date();
        console.log('time version: ' + (now.valueOf() - time.valueOf()));
    }
}