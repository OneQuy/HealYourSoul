import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { ThemeColor } from "../constants/Colors";
import { IsInternetAvailableAsync, NetLord } from "./NetLord";
import { HandleAppConfigAsync } from "./AppConfigHandler";
import { HandleStartupAlertAsync } from "./StartupAlert";
import { toast } from "@baronha/ting";
import { LocalText } from "../constants/AppConstants";
import { ToastTheme } from "./AppUtils";
import { InitTrackingAsync } from "./tracking/Tracking";
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp";

export type LoadAppDataResult = {
    categoryScreenToOpenFirst: keyof DrawerParamList | null
}

export async function LoadAppData(theme: ThemeColor): Promise<LoadAppDataResult> {
    // firebase init

    FirebaseInit();

    // cheat clear all local file

    await CheckAndClearAllLocalFileBeforeLoadApp();

    // init net checker

    await NetLord.InitAsync();

    // handle: app config (must be first after init NetLord)

    const isInternet = await IsInternetAvailableAsync()

    if (!isInternet) {
        toast({
            title: LocalText.offline_mode,
            ...ToastTheme(theme, 'none')
        })
    }
    else
        await HandleAppConfigAsync()

    // init tracking

    InitTrackingAsync()
    
    // handle alert (must after app config)

    await HandleStartupAlertAsync() // alert_priority 1 (doc)
    
    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)

    // handle: versions file

    await HandleVersionsFileAsync(theme);

    // load screen to open

    const categoryScreenToOpenFirst = await AsyncStorage.getItem('categoryScreenToOpenFirst');

    // return

    return {
        categoryScreenToOpenFirst
    } as LoadAppDataResult;
}