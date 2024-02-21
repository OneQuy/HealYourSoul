import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { ThemeColor } from "../constants/Colors";
import { NetLord } from "./NetLord";
import { HandleAppConfigAsync } from "./AppConfigHandler";
import { HandleStartupAlertAsync } from "./StartupAlert";
import { StorageKey_ScreenToInit } from "../constants/AppConstants";
import { InitTracking } from "./tracking/Tracking";
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp";
import { initNotificationAsync } from "./Nofitication";
import { CheckIsDevAsync, IsDev } from "./IsDev";
import { InitUserIDAsync, UserID } from "./UserID";
import TelemetryDeck from "@telemetrydeck/sdk";
import { createTelemetryDeckClient } from "./TelemetryDeck/TelemetryDeck";
import { TELEMETRY_DECK_KEY } from "../../keys";

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

    await HandleAppConfigAsync()

    // check is dev (must after app config)

    await CheckIsDevAsync()

    // init tracking (must after app config)

    InitTracking()

    // handle alert (must after app config)

    await HandleStartupAlertAsync() // alert_priority 1 (doc)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)

    // init noti

    await initNotificationAsync() // alert_priority 3 (doc)

    // handle: versions file

    await HandleVersionsFileAsync();

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