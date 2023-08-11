import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import NetInfo from '@react-native-community/netinfo'

export type LoadAppDataResult = {
    categoryScreenToOpenFirst: keyof DrawerParamList | null
}

export async function LoadAppData(): Promise<LoadAppDataResult> {
    NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
      })

    // firebase init

    FirebaseInit();

    // cheat clear all data

    await CheckAndClearAllLocalFileBeforeLoadApp();
  
    // handle: versions file

    let error = await HandleVersionsFileAsync();

    if (error) {
        throw new Error('HandleVersionsFile: Failed: ' + error);
    }

    // load screen to open

    const categoryScreenToOpenFirst = await AsyncStorage.getItem('categoryScreenToOpenFirst');

    return {
        categoryScreenToOpenFirst
    } as LoadAppDataResult;
}