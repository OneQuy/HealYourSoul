const firebaseStorage = require('firebase/storage')
const fs = require('fs');
const { CheckAndMkDirOfFilepathjAsync } = require('./FileUtils');

const TimeOutError = '[time_out]'

var storage = null;

function CheckAndInit() {
    if (storage)
        return;

    storage = firebaseStorage.getStorage();
}

function ArrayBufferToBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

async function GetDownloadURLAsync(fbRelativePath, getDownloadURLTimeOut = DefaultGetDownloadURLTimeOut) {
    try {
        CheckAndInit();
        let starsRef = firebaseStorage.ref(storage, fbRelativePath);
        let url;

        if (getDownloadURLTimeOut > 0) {
            const timeOutPromise = new Promise((resolve) => setTimeout(resolve, getDownloadURLTimeOut, TimeOutError))
            url = await Promise.any([firebaseStorage.getDownloadURL(starsRef), timeOutPromise]);
        }
        else
            url = await firebaseStorage.getDownloadURL(starsRef);

        if (url === TimeOutError)
            throw TimeOutError
        else {
            return {
                url,
                error: null,
            };
        }
    }
    catch (error) {
        return {
            url: null,
            error
        };;
    }
}

/**
 * @usage DownloadAsync('quote/list.json', '/Users/onequy/Downloads/hehe/hihi.json')
 * @param {*} filepath can be RLP or FLP
 * @returns null if success, otherwise error
 * @MAYBE error could be unknown type OR look like this: 
[StorageError [FirebaseError]: Firebase Storage: Object 'quote/lisjjt.json' does not exist. (storage/object-not-found)] {
  code: 'storage/object-not-found',
  customData: { serverResponse: '' },
  status_: 0,
  _baseMessage: "Firebase Storage: Object 'quote/lisjjt.json' does not exist. (storage/object-not-found)"
}
 */
async function DownloadAsync(firebasePath, filepath) {
    try {
        CheckAndInit();
        let theRef = firebaseStorage.ref(storage, firebasePath)
        const bytes = await firebaseStorage.getBytes(theRef)

        const resMkDir = await CheckAndMkDirOfFilepathjAsync(filepath);

        if (resMkDir)
            throw resMkDir;

        fs.writeFileSync(filepath, ArrayBufferToBuffer(bytes))
        return null;
    }
    catch (error) {
        return error;
    }
}

/**
 * @maybe error could be unknown type OR look like this: 
 * 
[StorageError [FirebaseError]: Firebase Storage: Object 'quoteee/list.json' does not exist. (storage/object-not-found)] {
  code: 'storage/object-not-found',
  customData: { serverResponse: '' },
  status_: 0,
  _baseMessage: "Firebase Storage: Object 'quoteee/list.json' does not exist. (storage/object-not-found)"
}
 */
async function DownloadTextAsync(firebasePath) {
    try {
        CheckAndInit();
        let theRef = firebaseStorage.ref(storage, firebasePath)
        const bytes = await firebaseStorage.getBytes(theRef)
        const text = String.fromCharCode.apply(null, new Uint8Array(bytes));

        return {
            text,
            error: null
        }
    }
    catch (error) {
        return {
            text: null,
            error
        }
    }
}

module.exports = {
    GetDownloadURLAsync,
    DownloadTextAsync,
    DownloadAsync
}