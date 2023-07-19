import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";

export async function LoadAppData() {
    // await new Promise(resolve => setTimeout(resolve, 5000))

    // firebase init

    FirebaseInit();

    // cheat clear all data

    await CheckAndClearAllLocalFileBeforeLoadApp();

    // handle: versions file

    var error = await HandleVersionsFileAsync();

    if (error) {
        //todo: dialog show here & need reload
        throw 'HandleVersionsFile: Failed: ' + error;
    }

    //  // handle: warm list file

    //  error = await HandleWarmOnLoadAppAsync();

    //  if (error)
    //  {
    //      //todo: dialog show here & need reload
    //      throw 'HandleWarmOnLoadApp: Failed: ' + error;
    //  }
}