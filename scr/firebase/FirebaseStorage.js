// https://firebase.google.com/docs/storage/web/download-files

import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { ErrorObject_Empty } from "../CommonConstants";
import { DeleteAsync, DownloadFileAsync, DownloadFile_GetJsonAsync, IsFileOrDirExistAsync, WriteTextToFileAsync } from "../ExpoFileSystem";
import { ErrorObject_FileNotFound, ErrorObject_NoIdentity, GetTempFileRLP, IsErrorObject_Empty } from "../Utils/Utils";

var storage = null;

function CheckAndInit() {    
    if (!storage)
        storage = getStorage();
}

// Usage:  
// FirebaseStorage_GetDownloadURL('data/warm/content/0/33.mp4', (url)=>{ console.log(url); }, (error)=>{ console.error(error); }); 
export function FirebaseStorage_GetDownloadURL(relativePath, urlCallback, errorCallback)
{
    CheckAndInit();
    let starsRef = ref(storage, relativePath);

    getDownloadURL(starsRef)
        .then((url) => {
            if (urlCallback)
            {
                urlCallback(url);
            }
        })
        .catch((error) => {        
            // https://firebase.google.com/docs/storage/web/handle-errors
            if (errorCallback)
            {
                errorCallback(error);
            }
        });
}

/**
return { url, error };
*/
export async function FirebaseStorage_GetDownloadURLAsync(relativePath)
{
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

export async function FirebaseStorage_DownloadAsync(relativeFirebasePath, relativeLocalPath)
{
    try {
        // get url

        let urlResult = await FirebaseStorage_GetDownloadURLAsync(relativeFirebasePath);         
        
        if (urlResult.error)
        {
            return {
                fileFullLocalPath: null,                              
                error: urlResult.error
            };
        }

        // downoad & get full file local path

        let result = await DownloadFileAsync(urlResult.url, relativeLocalPath);
        return result;
    } 
    catch (error) {
        return {
            fileFullLocalPath: null,                              
            error: error
        };;
    }
}

export async function FirebaseStorage_UploadAsync(relativeFirebasePath, fileURI) // main 
{
    try {
        let fileExists = await IsFileOrDirExistAsync(fileURI);
        
        if (!fileExists)
        {
            return ErrorObject_FileNotFound("Local file not found: " + fileURI);
        }

        CheckAndInit();
        let fireRef = ref(storage, relativeFirebasePath);         
        let respone = await fetch(fileURI);
        let blob = await respone.blob();
        await uploadBytes(fireRef, blob);
        
        return ErrorObject_Empty;
    } 
    catch (error) {
        return ErrorObject_NoIdentity(error);
    }
}

export async function FirebaseStorage_UploadTextAsFileAsync(relativeFirebasePath, text) // sub 
{
    // write to local file

    let tempRLP = GetTempFileRLP(true);
    let resObj = await WriteTextToFileAsync(text, tempRLP)

    // upload this file

    if (!IsErrorObject_Empty(resObj.errorObject)) // failed
    {
        return resObj.errorObject;
    }
    
    let tempFLP = resObj.fullLocalPath;

    resObj = await FirebaseStorage_UploadAsync(relativeFirebasePath, tempFLP);

    // delete file

    await DeleteAsync(tempFLP, false)

    // return

    return resObj;
}

export async function FirebaseStorage_DownloadAndReadJsonAsync(firebaseRelativePath, saveLocalRelativePath)
{
    // get full URL

    var result = await FirebaseStorage_GetDownloadURLAsync(firebaseRelativePath);     
    
    if (!result.url)
    {
        return {
            json: null,
            error: result.error
        };        
    }
    
    // download json & read 

    result = await DownloadFile_GetJsonAsync(result.url, saveLocalRelativePath)
    
    if (!result.json)
    {
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