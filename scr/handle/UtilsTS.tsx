// file / dir

import { Platform } from "react-native";

export function GetFileExtensionByFilepath(filepath: string): string {
    var dotIdx = filepath.lastIndexOf('.');

    if (dotIdx == -1)
        return '';

    return filepath.substring(dotIdx + 1, filepath.length);
}


export function GetBlobFromFLPAsync(flp: string): Promise<Blob> {   
    return new Promise((resolve, reject) => {
        if (!flp)
        {
            reject(new Error('GetBlobFromFLPAsync: flp is null/empty'));
            return;
        }

        if (Platform.OS === 'android' && !flp.startsWith('file://'))
        {
            flp = 'file://' + flp;
        }

        const xhr = new XMLHttpRequest();

        // If successful -> return with blob
        xhr.onload = function () {
            resolve(xhr.response);
        };

        // reject on error
        xhr.onerror = function () {
            reject(new Error('GetBlobFromFLPAsync failed, flp: ' + flp));
        };

        // Set the response type to 'blob' - this means the server's response 
        // will be accessed as a binary object
        xhr.responseType = 'blob';

        // Initialize the request. The third argument set to 'true' denotes 
        // that the request is asynchronous
        xhr.open('GET', flp, true);

        // Send the request. The 'null' argument means that no body content is given for the request
        xhr.send(null);
    });
};
