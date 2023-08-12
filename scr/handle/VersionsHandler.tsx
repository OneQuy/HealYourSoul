import { toast } from "@baronha/ting";
import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { IsInternetAvailable, ToastTheme } from "./AppUtils";
import { Cheat } from "./Cheat";
import { LocalText } from "../constants/AppConstants";
import { ThemeColor } from "../constants/Colors";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    draw: number,
    quote: number,
    real: number
}

export var versions: Versions;

export async function HandleVersionsFileAsync(theme: ThemeColor) {    
    let time = new Date();       

    const isInternet = await IsInternetAvailable();

    if (!isInternet) {
        toast({ 
            title: LocalText.offline_mode,
            preset: 'none',
            ...ToastTheme(theme)
        })
    }        

    const result = await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath);
    
    if (result.error)
    {
        console.error(result.error);
        return result.error;
    }

    versions = result.value as Versions;

    if (Cheat('IsLog_TimeVersion'))
    {
        let now = new Date();       
        console.log('time version: ' + (now.valueOf() - time.valueOf()));
    }
    
    return null;
}