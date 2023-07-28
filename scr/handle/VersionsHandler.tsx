import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { Cheat } from "./Cheat";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    draw: number,
    quote: number,
    real: number
}

export var versions: Versions;

export async function HandleVersionsFileAsync() {    
    let time = new Date();       
    var result = await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath);
    
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