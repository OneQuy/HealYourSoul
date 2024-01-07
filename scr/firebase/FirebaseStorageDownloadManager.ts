import { DownloadProgressCallbackResult } from "react-native-fs"
import { FirebaseStorage_DownloadByGetURLAsync } from "./FirebaseStorage";

export type DownloadFileConfig = {
    firebaseRLP: string,
    localSavePath: string,
    isRLP: boolean,
    progressCallback?: (p: DownloadProgressCallbackResult) => void,
}

// export const DownloadList = async (list: DownloadFileConfig[]) => {
//     const error = await FirebaseStorage_DownloadByGetURLAsync(fbPath, uri, false, progress);

// }