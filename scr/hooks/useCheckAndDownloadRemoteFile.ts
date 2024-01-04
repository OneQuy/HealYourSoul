import { useCallback, useEffect, useState } from "react";
import { DownloadFileAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "../handle/FileUtils";

type ReturnType = 'uri' | 'json' | 'text'

/**
 * 
 * @returns result: undefined if error
 * @returns error: undefined if success or error
 */
export default function useCheckAndDownloadRemoteFile(
    fileURL: string,
    localPath: string,
    isRLP: boolean,
    remoteVersion: number | undefined,
    returnType: ReturnType,
    isLog: boolean,
    localVersionGetterAsync: () => Promise<any>,
    localVersionSetterAsync: () => Promise<void>,
): readonly [
    result: string | object | undefined,
    error: any,
    isDataLatestFromRemoteOrLocal: boolean] {
    const [result, setResult] = useState<string | object | undefined>(undefined)
    const [error, setError] = useState<any>(undefined)
    const [isDataLatestFromRemoteOrLocal, setIsDataLatestFromRemoteOrLocal] = useState(false)

    const isNeedToDownloadAsync = useCallback(async () => {
        const isLocalFileExisted = await IsExistedAsync(localPath, isRLP)

        if (!isLocalFileExisted) {
            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] isNeedToDownload cuz local not existed')

            return true
        }
        if (remoteVersion === undefined)
            return false

        const localVersionS = await localVersionGetterAsync()
        const localVersion = typeof localVersionS === 'string' ? Number.parseInt(localVersionS) : -1

        if (isLog && localVersion !== remoteVersion)
            console.log('[useCheckAndDownloadRemoteFile] isNeedToDownload cuz diff version')

        return localVersion !== remoteVersion
    }, [remoteVersion])

    const mainHanldeAsync = useCallback(async () => {
        let downloadError = undefined

        // 1. check need to download or not

        const isNeedToDownload = await isNeedToDownloadAsync()

        // 2. download if needed

        if (isLog)
            console.log('[useCheckAndDownloadRemoteFile] isNeedToDownload: ' + isNeedToDownload)

        if (isNeedToDownload) {
            const res = await DownloadFileAsync(fileURL, localPath, isRLP)

            if (res !== null) { // download fail
                downloadError = res
            }
            else { // download success
                localVersionSetterAsync()
            }

            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] download success: ' + (res === null) + ', error (any): ' + res)
        }

        // 3. in case return uri if needed

        if (returnType === 'uri') {
            const isLocalFileExisted = await IsExistedAsync(localPath, isRLP)

            if (isLocalFileExisted) {
                const uri = isRLP ? GetFLPFromRLP(localPath, true) : localPath
                setResult(uri)
                setError(undefined)
                setIsDataLatestFromRemoteOrLocal(downloadError === undefined)

                if (isLog)
                    console.log('[useCheckAndDownloadRemoteFile] result uri sucess: ' + uri)
            }
            else {
                setResult(undefined)

                if (downloadError)
                    setError(downloadError)
                else
                    setError(new Error('Local file not found: ' + localPath))

                if (isLog)
                    console.log('[useCheckAndDownloadRemoteFile] result uri failed')
            }

            return
        }

        // 4. read local

        const readLocalRes = await ReadTextAsync(localPath, isRLP)

        if (readLocalRes.text) { // read local success
            if (returnType === 'text')
                setResult(readLocalRes.text)
            else
                setResult(JSON.parse(readLocalRes.text))

            setError(undefined)
            setIsDataLatestFromRemoteOrLocal(downloadError === undefined)

            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] result sucess')
        }
        else { // read local fail
            setResult(undefined)

            if (downloadError)
                setError(downloadError)
            else
                setError(readLocalRes.error)

            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] result fail')
        }
    }, [isNeedToDownloadAsync])

    useEffect(() => {
        mainHanldeAsync()
    }, [mainHanldeAsync])

    return [
        result,
        error,
        isDataLatestFromRemoteOrLocal]
}