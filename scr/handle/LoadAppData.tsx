import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { ThemeColor } from "../constants/Colors";
import { Alert } from "react-native";

export type LoadAppDataResult = {
    categoryScreenToOpenFirst: keyof DrawerParamList | null
}

export async function LoadAppData(theme: ThemeColor): Promise<LoadAppDataResult> {
    // firebase init

    FirebaseInit();

    // cheat clear all data

    await CheckAndClearAllLocalFileBeforeLoadApp();
  
    // handle: versions file

    await HandleVersionsFileAsync(theme);

    // load screen to open

    const categoryScreenToOpenFirst = await AsyncStorage.getItem('categoryScreenToOpenFirst');

    return {
        categoryScreenToOpenFirst
    } as LoadAppDataResult;
}