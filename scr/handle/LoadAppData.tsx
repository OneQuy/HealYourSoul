import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { ThemeColor } from "../constants/Colors";
import { NetLord } from "./NetLord";
import { HandleAppConfigAsync } from "./AppConfigHandler";
import { HandleStartupAlert } from "./StartupAlert";
// import Clipboard from "@react-native-clipboard/clipboard";
// import { toast } from "@baronha/ting";

// //todo
// export var MaxPostsDownloadOnce: number = 10

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

    await HandleAppConfigAsync(theme)

    // handle alert (must after app config)

    await HandleStartupAlert()

    // handle: versions file

    await HandleVersionsFileAsync(theme);

    // load screen to open

    const categoryScreenToOpenFirst = await AsyncStorage.getItem('categoryScreenToOpenFirst');

    // return

    return {
        categoryScreenToOpenFirst
    } as LoadAppDataResult;
}