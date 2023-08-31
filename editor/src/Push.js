const { PullFileListAsync } = require("./PullData")
const { GetFileExtensionByFilepath } = require("./common/Utils")

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

async function UploadPostAsync(category, title, author, url, notDeleteFilesAfterPush, smartAuthor) {
    const start = Date.now()

    const mediaURIs = GetMediaURIs()

    if (mediaURIs.length === 0) {
        LogRed('no media to upload');
        return
    }
    else
        console.log(mediaURIs);

    firebase.FirebaseInit()

    const fileList = await PullFileListAsync(category)
    const latestID = fileList.posts.length > 0 ? fileList.posts[0].id : -1;
    const smartAuthorRes = SmartAuthor(smartAuthor)

    if (!author)
        author = smartAuthorRes ? smartAuthorRes.author : ''

    if (!title)
        title = ''

    if (!url)
        url = smartAuthorRes ? smartAuthorRes.url : ''

    const mediaTypeArr = UriArrToMediaTypeArr(mediaURIs)

    const newPost = {
        id: latestID + 1,
        author,
        url,
        title,
        media: mediaTypeArr
    }

    console.log(newPost);

    fileList.posts.unshift(newPost);
    fileList.version++;

    for (let index = 0; index < mediaURIs.length; index++) {

        const fbpath = GetFirebasePath(category, latestID + 1, index);
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
            //     fbpath = GetFirebasePath(category, latestID + 1, i);
            //     await FirebaseStorage_DeleteAsync(fbpath);
            //     setProcessText('deleted: ' + fbpath);
            // }

            // clearAll();
            // setProcessText('deleted all uploaded');
            // return;
        }
    }

    var res = await firebaseStorage.UploadTextAsync(`${category}/list.json`, JSON.stringify(fileList, null, 1));

    if (res) {
        LogRed('Failed upload list.json. Uploaded medias of Post ID: ' + (latestID + 1), res);
        return;
    }

    const error = await FirebaseDatabase_SetValueAsync(`/app/versions/${category}`, fileList.version);

    if (!error) {
        console.log('FileList & DB version: ' + fileList.version + ', Post ID: ' + (latestID + 1), '\ntime: ' + (Date.now() - start));
        LogGreen('[SUCCESS]')
    }
    else
        LogRed('Failed increase DB version. Uploaded medias and list.json of post ID: ' + (latestID + 1), '' + error);

    if (!notDeleteFilesAfterPush) {
        mediaURIs.forEach(element => {
            fs.unlinkSync(element)
        });
    }

    process.exit()
}


module.exports = {
    UploadPostAsync,
}