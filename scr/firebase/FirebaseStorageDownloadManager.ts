import { DownloadProgressCallbackResult } from "react-native-fs"
import { FirebaseStorage_DownloadByGetURLAsync } from "./FirebaseStorage";
import { ArrayRemove } from "../handle/UtilsTS";

const downloadingFiles: DownloadFileConfig[] = []

export type DownloadFileConfig = {
    firebaseRLP: string,
    localSavePath: string,
    isRLP: boolean,
    progressCallback?: (p: DownloadProgressCallbackResult) => void,
    onDone?: (error: any) => void,
}

export async function CheckDuplicateAndDownloadAsync(
    firebaseRLP: string,
    localSavePath: string,
    isRLP: boolean,
    progressCallback?: (p: DownloadProgressCallbackResult) => void): Promise<any> {
    return await new Promise((resolve) => {
        CheckDuplicateAndDownload({
            firebaseRLP,
            localSavePath,
            isRLP,
            progressCallback,
            onDone: (error) => {
                if (error)
                    resolve(error)
                else
                    resolve(null)
            }
        })
    })
}

const CheckDuplicateAndDownload = (config: DownloadFileConfig) => {
    const downloadingFile = downloadingFiles.find(f =>
        config.firebaseRLP === f.firebaseRLP &&
        config.localSavePath === f.localSavePath &&
        config.isRLP === f.isRLP)

    if (downloadingFile) { // is queued & downloading 
        console.log('is queued & downloading:', downloadingFile.firebaseRLP)

        if (config.progressCallback)
            downloadingFile.progressCallback = config.progressCallback

        if (config.onDone)
            downloadingFile.onDone = config.onDone
    }
    else {
        console.log('push new download:', config.firebaseRLP)

        downloadingFiles.push(config)

        FirebaseStorage_DownloadByGetURLAsync(
            config.firebaseRLP,
            config.localSavePath,
            config.isRLP,
            (e: DownloadProgressCallbackResult) => {
                if (typeof config.progressCallback === 'function')
                    config.progressCallback(e)
            })
            .then((error) => {
                if (typeof config.onDone === 'function')
                    config.onDone(error)

                const removed = ArrayRemove(downloadingFiles, config)

                console.log('done and removed: ', config.firebaseRLP, ' error: ' + error);
            })
    }
}