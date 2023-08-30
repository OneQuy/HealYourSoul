const { PullFileListAsync } = require("./PullData")
const { GetFileExtensionByFilepath } = require("./common/Utils")

const firebase = require('./common/Firebase_NodeJS')
const firebaseStorage = require('./common/FirebaseStorage_NodeJS');
const fs = require('fs');
const { FirebaseDatabase_SetValueAsync } = require("./common/FirebaseDatabase_NodeJS");

function GetFirebasePath(category, id, idx) {
    return `${category}/data/${id}/${idx}`
}

const GetMediaURIs = () => {
    const dir = process.platform === 'win32' ? 'C:\\Users\\Admin\\Downloads\\' : '/Users/onequy/Downloads/'
    
    const res = []

    for (let i = 0; i < 100; i++) {
        let flp = `${dir}${i}.jpg`

        if (fs.existsSync(flp)) {
            res.push(flp)
            continue
        }

        flp = `${dir}${i}.jpeg`

        if (fs.existsSync(flp)) {
            res.push(flp)
            continue
        }

        flp = `${dir}${i}.mp4`

        if (fs.existsSync(flp)) {
            res.push(flp)
            continue
        }

        return res
    }
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

async function UploadPostAsync(category, title, author, url) {
    const start = Date.now()

    const mediaURIs = GetMediaURIs()

    if (mediaURIs.length === 0) {
        console.error('no media to upload');
        return
    }
    else
        console.log(mediaURIs);

    firebase.FirebaseInit()

    const fileList = await PullFileListAsync(category)
    const latestID = fileList.posts.length > 0 ? fileList.posts[0].id : -1;

    if (!author)
        author = ''

    if (!title)
        title = ''

    if (!url)
        url = ''

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
            console.error('NEED TO ROLL BACK MANUALLY!! upload file failed: ' + fbpath, 'error: ' + uploadRes);
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
        console.log('Failed upload list.json. Uploaded medias of Post ID: ' + (latestID + 1), res);
        return;
    }

    const error = await FirebaseDatabase_SetValueAsync(`/app/versions/${category}`, fileList.version);

    if (!error) {
        console.log('[SUCCESS]')
        console.log('FileList & DB version: ' + fileList.version + ', Post ID: ' + (latestID + 1), '\ntime: ' + (Date.now() - start));
    }
    else
        console.log('Failed increase DB version. Uploaded medias and list.json of post ID: ' + (latestID + 1), '' + error);

    mediaURIs.forEach(element => {
        fs.unlinkSync(element)
    });

    process.exit()
}


module.exports = {
    UploadPostAsync,
}