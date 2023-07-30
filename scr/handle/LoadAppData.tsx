import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";

export async function LoadAppData() {
    // firebase init

    FirebaseInit();

    // cheat clear all data

    await CheckAndClearAllLocalFileBeforeLoadApp();
  
    // handle: versions file

    var error = await HandleVersionsFileAsync();

    if (error) {
        throw new Error('HandleVersionsFile: Failed: ' + error);
    }
}