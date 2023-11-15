import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { HandleError } from "./AppUtils";
import { Cheat } from "./Cheat";
import { ThemeColor } from "../constants/Colors";
import { IsInternetAvailableAsync } from "./NetLord";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    draw: number,
    quote: number,
    meme: number,
    catdog: number,
    love: number,
    satisfying: number,
    nsfw: number,
}

export var versions: Versions;

export async function HandleVersionsFileAsync(theme: ThemeColor) {
    let time = new Date();
   
    const isInternet = await IsInternetAvailableAsync();

    if (!isInternet) {
        return;
    }

    const result = await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath);

    // fail

    if (result.error) {
        HandleError('HandleVersions', result.error, theme)
        return;
    }

    // success

    versions = result.value as Versions;

    if (Cheat('IsLog_TimeVersion')) {
        let now = new Date();
        console.log('time version: ' + (now.valueOf() - time.valueOf()));
    }
}