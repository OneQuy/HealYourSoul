import { FirebaseDatabase_GetValueAsync } from "../firebase/FirebaseDatabase";
import { Cheat } from "./Cheat";

const FirebaseDBAppVersionsPath = 'app/versions';

export type Versions = {
    copyright: number,
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

// export async function IncreaseVersionAsync_Warm() {           
//     let isLog = false;
//     // get current version

//     var result = await FirebaseDatabase_GetValueAsync(FirebaseDBAppVersionsPath);
    
//     if (result.error)
//     {
//         console.error('IncreaseVersionAsync_Warm get current version error: ' + result.error);
//         return result.error;
//     }

//     // increase version
    
//     if (isLog)
//         console.log('IncreaseVersionAsync_Warm, old version: ' + result.value.warm)

//     result.value.warm = result.value.warm + 1;

//     let error = await FirebaseDatabase_SetValueAsync(FirebaseDBAppVersionsPath, result.value);

//     if (error)
//     {
//         console.error('IncreaseVersionAsync_Warm() increased version but can not upload value to firebase db, error: ' + error);
//         return ErrorObject_JustError(error);
//     }

//     if (isLog)
//         console.log('IncreaseVersionAsync_Warm set firebase successfully, new version: ' + result.value.warm)
        
//     return ErrorObject_Empty;
// }