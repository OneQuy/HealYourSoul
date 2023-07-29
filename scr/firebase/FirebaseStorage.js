// https://firebase.google.com/docs/storage/web/download-files

import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { ErrorObject_Empty } from "../constants/CommonConstants";
import { ErrorObject_FileNotFound, ErrorObject_NoIdentity, GetTempFileRLP, IsErrorObject_Empty } from "../handle/Utils";
import { DeleteFileAsync, DownloadFileAsync, DownloadFile_GetJsonAsync, GetFLPFromRLP, IsExistedAsync, WriteTextAsync } from "../handle/FileUtils";
import { GetBlobFromFLPAsync } from "../handle/UtilsTS";

var storage = null;

function CheckAndInit() {
    if (!storage)
        storage = getStorage();
}

// Usage:  
// FirebaseStorage_GetDownloadURL('data/warm/content/0/33.mp4', (url)=>{ console.log(url); }, (error)=>{ console.error(error); }); 
export function FirebaseStorage_GetDownloadURL(relativePath, urlCallback, errorCallback) {
    CheckAndInit();
    let starsRef = ref(storage, relativePath);

    getDownloadURL(starsRef)
        .then((url) => {
            if (urlCallback) {
                urlCallback(url);
            }
        })
        .catch((error) => {
            // https://firebase.google.com/docs/storage/web/handle-errors
            if (errorCallback) {
                errorCallback(error);
            }
        });
}

/**
return { url, error };
*/
export async function FirebaseStorage_GetDownloadURLAsync(relativePath) {
    try {
        CheckAndInit();
        let starsRef = ref(storage, relativePath);
        let url = await getDownloadURL(starsRef);
        return {
            url: url,
            error: null
        };
    }
    catch (error) {
        return {
            url: null,
            error: error
        };;
    }
}

/**
 * @returns null if sucess, otherwise error
 */
export async function FirebaseStorage_DeleteAsync(relativePath) {
    try {
        CheckAndInit();
        const starsRef = ref(storage, relativePath);
        await deleteObject(starsRef);
        return null;
    }
    catch (error) {
        return error;
    }
}

/**
 * @returns null if success, otherwise error
 */
export async function FirebaseStorage_DownloadAsync(relativeFirebasePath, savePath, isRLP) {
    try {
        // get url

        let urlResult = await FirebaseStorage_GetDownloadURLAsync(relativeFirebasePath);

        if (urlResult.error) {
            return urlResult.error;
        }

        // downoad

        let result = await DownloadFileAsync(urlResult.url, savePath, isRLP);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * @returns ErrorObject_Empty if success, ErrorObject_NoIdentity(error) if fail
 */
export async function FirebaseStorage_UploadAsync(relativeFirebasePath, fileFLP) // main 
{
    try {
        let fileExists = await IsExistedAsync(fileFLP, false);

        if (!fileExists) {
            return ErrorObject_FileNotFound("Local file not found: " + fileFLP);
        }

        // let respone = await fetch(fileFLP); // this way get error: Network request failed
        // let blob = await respone.blob();

        CheckAndInit();
        const theRef = ref(storage, relativeFirebasePath);
        const blob = await GetBlobFromFLPAsync(fileFLP);
        await uploadBytes(theRef, blob);

        return ErrorObject_Empty;
    }
    catch (error) {
        return ErrorObject_NoIdentity(error);
    }
}

/**
 * 
 * @returns ErrorObject_Empty if success, ErrorObject_NoIdentity(error) if fail
 */
export async function FirebaseStorage_UploadTextAsFileAsync(relativeFirebasePath, text) // sub 
{
    // write to local file

    let tempRLP = GetTempFileRLP(true);
    let res = await WriteTextAsync(tempRLP, text);

    // upload this file

    if (res) // failed
    {
        return res;
    }

    let tempFLP = GetFLPFromRLP(tempRLP, true);
    res = await FirebaseStorage_UploadAsync(relativeFirebasePath, tempFLP);

    // delete file

    var delErr = await DeleteFileAsync(tempFLP, false)

    if (delErr)
        console.error('delete tempFLP after upload error: ' + delErr);

    // return

    return res;
}

export async function FirebaseStorage_DownloadAndReadJsonAsync(firebaseRelativePath, saveLocalRelativePath) {
    // get full URL

    var result = await FirebaseStorage_GetDownloadURLAsync(firebaseRelativePath);

    if (!result.url) {
        return {
            json: null,
            error: result.error
        };
    }

    // download json & read 

    result = await DownloadFile_GetJsonAsync(result.url, saveLocalRelativePath)

    if (!result.json) {
        return {
            json: null,
            error: result.error
        };
    }

    return {
        json: result.json,
        error: null
    };
}