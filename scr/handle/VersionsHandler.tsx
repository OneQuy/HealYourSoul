import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { HandleError } from "./AppUtils";
import { ExecuteWithTimeoutAsync } from "./UtilsTS";
import { FirebaseDatabaseTimeOutMs, LocalText } from "../constants/AppConstants";
import { toast } from "@baronha/ting";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    draw: number,
    quote: number,
    meme: number,
    catdog: number,
    love: number,
    satisfying: number,
    nsfw: number,
    cute: number,
    art: number,
    sarcasm: number,
    awesome: number,
    typo: number,
    sunset: number,
    info: number,
    tune: number,
    vocabulary: number,
}

export var versions: Versions;

/**
 * 
 * @returns true if dl success
 */
export async function HandleVersionsFileAsync(): Promise<boolean> {
    let tick = Date.now()

    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath),
        FirebaseDatabaseTimeOutMs)

    // fail time out

    if (res.isTimeOut || res.result === undefined) {
        HandleError('HandleVersions', 'TimeOut-' + (Date.now() - tick))

        toast({ title: LocalText.offline_mode }) // toast offline

        return false
    }

    const result = res.result

    // fail firebase

    if (result.error) {
        HandleError('HandleVersions', result.error)
        return false
    }

    // success

    versions = result.value as Versions

    return true
}