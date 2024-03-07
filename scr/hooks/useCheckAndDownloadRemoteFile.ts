import { useCallback, useEffect, useState } from "react";
import { DownloadFileAsync, GetFLPFromRLP, IsExistedAsync, ReadTextAsync } from "../handle/FileUtils";

type ReturnType = 'uri' | 'json' | 'text'

/**
 * hook runs whenever [remoteVersion] changed
 * 
 * note: still handling if result === undefined && error === undefined
 * @returns result: undefined if error
 * @returns error: undefined if success or error
 * 
 * USAGE:
 * 
const { result, error, isDataLatestFromRemoteOrLocal, reUpdate, didDownload } = useCheckAndDownloadRemoteFile(
        fileURL,
        TempDirName + '/fun_website.json',
        true,
        GetRemoteFileConfigVersion('fun_websites'),
        'json',
        true,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_websites').toString()))
 */
export default function useCheckAndDownloadRemoteFile<T extends object>(
    fileURL: string,
    localPath: string,
    isRLP: boolean,
    remoteVersion: number | undefined,
    returnType: ReturnType,
    isLog: boolean,
    localVersionGetterAsync: () => Promise<any>,
    localVersionSetterAsync: () => Promise<void>,
): {
    result: string | T | undefined,
    error: any,
    isDataLatestFromRemoteOrLocal: boolean,
    reUpdateAsync: () => Promise<void>,
    didDownload: boolean,
} {
    const [result, setResult] = useState<string | T | undefined>(undefined)
    const [error, setError] = useState<any>(undefined)
    const [didDownload, setDidDownload] = useState(false)
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

        if (isLog) {
            if (localVersion !== remoteVersion)
                console.log('[useCheckAndDownloadRemoteFile] isNeedToDownload cuz diff version (' + localPath + ')')
            else
                console.log('[useCheckAndDownloadRemoteFile] NOT isNeedToDownload, same version: ' + localVersion + ' (' + localPath + ')')
        }

        return localVersion !== remoteVersion
    }, [remoteVersion])

    const reUpdateAsync = useCallback(async () => {
        let downloadError = undefined

        // 1. check need to download or not

        const isNeedToDownload = await isNeedToDownloadAsync()

        // 2. download if needed

        if (isNeedToDownload) {
            const res = await DownloadFileAsync(fileURL, localPath, isRLP)

            if (res !== null) { // download fail
                downloadError = res
            }
            else { // download success
                localVersionSetterAsync()
                setDidDownload(true)
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
                    console.log('[useCheckAndDownloadRemoteFile] SUCCESS ' + (downloadError === undefined ? '(latest data), uri: ' : '(local data), uri: ') + uri)
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
                setResult(JSON.parse(readLocalRes.text) as T)

            setError(undefined)
            setIsDataLatestFromRemoteOrLocal(downloadError === undefined)

            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] SUCCESS ' + (downloadError === undefined ? '(latest data)' : '(local data)'))
        }
        else { // read local fail
            setResult(undefined)

            if (downloadError)
                setError(downloadError)
            else
                setError(readLocalRes.error)

            if (isLog)
                console.log('[useCheckAndDownloadRemoteFile] FAILED')
        }
    }, [isNeedToDownloadAsync])

    useEffect(() => {
        reUpdateAsync()
    }, [reUpdateAsync])

    return {
        result,
        error,
        reUpdateAsync,
        isDataLatestFromRemoteOrLocal,
        didDownload,
    } as const
}