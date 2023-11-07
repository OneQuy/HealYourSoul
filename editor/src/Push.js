const { PullFileListAsync } = require("./PullData")
const { GetFileExtensionByFilepath } = require("./common/Utils")
const clipboard = require('copy-paste');
const firebase = require('./common/Firebase_NodeJS')
const firebaseStorage = require('./common/FirebaseStorage_NodeJS');
const fs = require('fs');
const { FirebaseDatabase_SetValueAsync } = require("./common/FirebaseDatabase_NodeJS");
const { LogRed, LogGreen } = require("./Utils_NodeJS");

function GetFirebasePath(category, id, idx) {
    return `${category}/data/${id}/${idx}`
}

const SmartAuthor = (hint) => {
    if (!hint)
        return undefined

    const creditsPath = process.platform === 'darwin' ? '/Users/onequy/Downloads/credits.txt' : 'C:\\Users\\Admin\\Downloads\\credits.txt'
    const text = fs.readFileSync(creditsPath, 'utf-8')
    const lines = text.split('\n')

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index];
        const arr = element.split(',')

        if (arr[0].toLowerCase().includes(hint.toLowerCase())) {
            return {
                author: arr[0],
                url: arr[1]
            }
        }
    }

    return undefined
}

const GetMediaURIs = () => {
    const dir = process.platform === 'win32' ? 'C:\\Users\\Admin\\Downloads\\' : '/Users/onequy/Downloads/'

    const files = fs.readdirSync(dir);

    const res = []

    if (files.length <= 0)
        return res

    for (let i = 0; i < files.length; i++) {
        const flp = dir + files[i]
        const ext = GetFileExtensionByFilepath(flp)
        let type

        try {
            type = GetMediaTypeByFileExtension(ext)
        }
        catch {
            if (ext !== '' &&
                ext !== 'DS_Store' &&
                ext !== 'localized' &&
                ext !== 'txt' &&
                ext !== 'rar' &&
                ext !== 'exe' &&
                ext !== 'dmg' &&
                ext !== 'zip' &&
                ext !== 'pdf' &&
                ext !== 'json' &&
                ext !== 'xls' &&
                ext !== 'docs' &&
                ext !== 'ini')
                LogRed('not supported file type: ' + files[i]);

            type = -1
        }

        if (type === -1)
            continue

        res.push(flp)
    }

    return res
}

const UriArrToMediaTypeArr = (uris) => {

    return uris.map(i => GetMediaTypeByFileExtension(GetFileExtensionByFilepath(i)));
}

function GetMediaTypeByFileExtension(extension) {
    extension = extension.toLowerCase();

    if (extension == 'jpg' ||
        extension == 'jpeg' ||
        extension == 'gif' ||
        extension == 'bmp' ||
        extension == 'webp' ||
        extension == 'png')
        return 0
    else if (extension == 'mp4')
        return 1
    else
        throw new Error(extension + ' extention is not able to regconize');
}

async function UploadPostAsync(category, title, author, authorUrl, notDeleteFilesAfterPush, smartAuthor, fromImgURL, fromVideoURL, onlyOverrideLatestMedia) {
    const start = Date.now()
    const isFromURL = fromImgURL !== undefined || fromVideoURL !== undefined

    let mediaURIs

    if (isFromURL) {
        if (fromImgURL === '') {
            fromImgURL = clipboard.paste()
            console.log('start upload from url', 'image', fromImgURL)
        }
        else if (fromVideoURL === '') {
            fromVideoURL = clipboard.paste()
            console.log('start upload from url', 'video', fromVideoURL)
        }
        else
            console.log('start upload from url', fromImgURL ? 'image' : 'video')
    }
    else {
        mediaURIs = GetMediaURIs()

        if (mediaURIs.length === 0) {
            LogRed('no media to upload');
            return
        }
        else
            console.log(mediaURIs);
    }

    firebase.FirebaseInit()

    const fileList = await PullFileListAsync(category)
    const latestID = fileList.posts.length > 0 ? fileList.posts[0].id : -1;
    const newPostID = onlyOverrideLatestMedia === true ? latestID : latestID + 1
    const smartAuthorRes = SmartAuthor(smartAuthor)

    if (!author)
        author = smartAuthorRes ? smartAuthorRes.author : ''

    if (!title)
        title = ''

    if (!authorUrl)
        authorUrl = smartAuthorRes ? smartAuthorRes.url : ''

    let mediaTypeArr

    if (isFromURL)
        mediaTypeArr = fromImgURL ? [0] : [1]
    else
        mediaTypeArr = UriArrToMediaTypeArr(mediaURIs)

    const newPost = {
        id: newPostID,
        author,
        url: authorUrl,
        title,
        media: mediaTypeArr
    }

    if (onlyOverrideLatestMedia === true)
        console.log('override latest media mode, id', newPostID)
    else
        console.log(newPost);

    fileList.posts.unshift(newPost);
    fileList.version++;

    // upload medias

    if (isFromURL) {
        const mime = fromImgURL ? 'image/jpeg' : 'video/mp4'
        const fbpath = GetFirebasePath(category, newPostID, 0)
        const error = await firebaseStorage.UploadFromFileUrlAsync(fbpath, fromImgURL ?? fromVideoURL, mime)

        if ((!error))
            console.log('uploaded: ' + fbpath);
        else {
            LogRed('NEED TO ROLL BACK MANUALLY!! upload file failed: ' + fbpath, 'error: ' + error);
            return
        }
    }
    else { // from local files
        for (let index = 0; index < mediaURIs.length; index++) {

            const fbpath = GetFirebasePath(category, newPostID, index);
            const flp = mediaURIs[index];
            const mime = mediaTypeArr[index] === 1 ? 'video/mp4' : 'image/jpeg'

            console.log('start index ' + index, flp);

            const uploadRes = await firebaseStorage.UploadAsync(fbpath, flp, mime);

            if ((!uploadRes))
                console.log('uploaded: ' + fbpath, `(${index + 1}\\${mediaURIs.length})`);
            else {
                LogRed('NEED TO ROLL BACK MANUALLY!! upload file failed: ' + fbpath, 'error: ' + uploadRes);
                return

                // // delete all uploaded files

                // for (let i = 0; i <= index; i++) {
                //     fbpath = GetFirebasePath(category, newPostID, i);
                //     await FirebaseStorage_DeleteAsync(fbpath);
                //     setProcessText('deleted: ' + fbpath);
                // }

                // clearAll();
                // setProcessText('deleted all uploaded');
                // return;
            }
        }
    }

    // delete files

    if (!notDeleteFilesAfterPush && !isFromURL) {
        mediaURIs.forEach(element => {
            fs.unlinkSync(element)
        });
    }

    if (onlyOverrideLatestMedia === true) {
        LogGreen('[SUCCESS]')
        return
    }

    // update list.json

    let error = await firebaseStorage.UploadTextAsync(`${category}/list.json`, JSON.stringify(fileList, null, 1));

    if (error) {
        LogRed('Failed upload list.json. Uploaded medias of Post ID: ' + newPostID, error);
        return;
    }

    // update version

    error = await FirebaseDatabase_SetValueAsync(`/app/versions/${category}`, fileList.version);

    if (!error) {
        console.log('FileList & DB version: ' + fileList.version + ', Post ID: ' + newPostID, '\ntime: ' + (Date.now() - start));
        LogGreen('[SUCCESS]')
    }
    else
        LogRed('Failed increase DB version. Uploaded medias and list.json of post ID: ' + newPostID, '' + error);

    // exit

    process.exit()
}


module.exports = {
    UploadPostAsync,
}