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

    await CheckAndClearAllLocalFileBeforeLoadApp();

    // user id

    await InitUserIDAsync()

    // handle: app config

    const successHandleAppConfig = await HandleAppConfigAsync()

    // check is dev (must after HandleAppConfigAsync)

    await CheckIsDevAsync()

    // init aptabase tracking (must after HandleAppConfigAsync & CheckIsDevAsync)

    InitAptabase()

    // handle alert (must after HandleAppConfigAsync)

    await HandleStartupAlertAsync() // alert_priority 1 (doc)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)

    // init noti

    await initNotificationAsync() // alert_priority 3 (doc)

    // one signal

    InitOneSignalAsync()  // alert_priority 4 (doc)

    // handle: versions file

    const successHandleFileVersions = await HandleVersionsFileAsync();

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