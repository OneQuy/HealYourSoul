import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { NetLord } from "./NetLord";
import { HandleAppConfigAsync } from "./AppConfigHandler";
import { HandleStartupAlertAsync } from "./StartupAlert";
import { StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_ScreenToInit } from "../constants/AppConstants";
import { InitAptabase } from "./tracking/Tracking";
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp";
import { initNotificationAsync } from "./Nofitication";
import { CheckIsDevAsync, IsDev } from "./IsDev";
import { InitUserIDAsync, UserID } from "./UserID";
import TelemetryDeck from "@telemetrydeck/sdk";
import { createTelemetryDeckClient } from "./TelemetryDeck/TelemetryDeck";
import { TELEMETRY_DECK_KEY } from "../../keys";
import { SetDateAsync_Now } from "./AsyncStorageUtils";
import { InitOneSignalAsync } from "./OneSignal";

export type LoadAppDataResult = {
    categoryScreenToOpenFirst: keyof DrawerParamList | null,
    telemetryDeckClient: TelemetryDeck,
}

export async function LoadAppData(): Promise<LoadAppDataResult> {
    // firebase init

    FirebaseInit();

    // init net checker

    NetLord.InitAsync();

    // cheat clear all local file

    await CheckAndClearAllLocalFileBeforeLoadApp(); // no depended

    // user id

    await InitUserIDAsync() // no depended

    // handle: app config

    const successHandleAppConfig = await HandleAppConfigAsync() // no depended

    // check is dev 

    await CheckIsDevAsync() // (must after HandleAppConfigAsync)

    // init aptabase tracking

    InitAptabase() // (must after HandleAppConfigAsync & CheckIsDevAsync)

    // handle alert (must after HandleAppConfigAsync)

    await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after HandleAppConfigAsync)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc) // (must after HandleAppConfigAsync)

    // init noti

    await initNotificationAsync() // alert_priority 3 (doc) // no depended

    // one signal

    InitOneSignalAsync()  // alert_priority MUST FINAL (doc) // no depended

    // handle: versions file

    const successHandleFileVersions = await HandleVersionsFileAsync(); // no depended

    if (successHandleAppConfig && successHandleFileVersions) {
        await SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)
    }

    // load screen to open

    const categoryScreenToOpenFirst = await AsyncStorage.getItem(StorageKey_ScreenToInit);

    // teleletry

    const telemetryDeckClient = createTelemetryDeckClient(TELEMETRY_DECK_KEY, UserID(), IsDev())

    // return

    return {
        categoryScreenToOpenFirst,
        telemetryDeckClient
    } as LoadAppDataResult
}