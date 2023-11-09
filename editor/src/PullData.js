const firebase = require('./common/Firebase_NodeJS')
const firebaseStorage = require('./common/FirebaseStorage_NodeJS');
const { RuntimeDir } = require('./Constant');
const fs = require('fs')

const GetFirebasePath = (cat, id, mediaIdx) => {
    return `${cat}/data/${id}/${mediaIdx}`
}

async function PullFileListAsync(cat) {
    firebase.FirebaseInit()

    const listRes = await firebaseStorage.DownloadTextAsync(`${cat}/list.json`)

    if (listRes.error) {
        console.error('donwload list.json error: ' + listRes.error.code);
        console.error(listRes.error)
        return
    }

    return JSON.parse(listRes.text)
}


async function PullAllAsync() {
    await Promise.all([
        await PullByTypeAsync('quote'),
        await PullByTypeAsync('draw'),
        await PullByTypeAsync('meme'),
        await PullByTypeAsync('love'),
        await PullByTypeAsync('catdog'),
        await PullByTypeAsync('satisfying'),
        await PullByTypeAsync('nsfw'),
    ])
}

/**
 * 
 * @param {*} cat quote, meme, draw, catdog, love, satisfying, nsfw
 * @param {*} fromID (undefined for first post)
 * @param {*} toID (underfined for last post)
 */
async function PullByTypeAsync(cat, fromID, toID) {
    console.log(cat);
    const startTick = Date.now()
    firebase.FirebaseInit()
    listJson = await PullFileListAsync(cat)

    const minID = listJson.posts[listJson.posts.length - 1].id
    const maxID = listJson.posts[0].id

    if (typeof fromID !== 'number' || fromID < minID) {
        fromID = minID
    }

    if (typeof toID !== 'number' || toID > maxID) {
        toID = maxID
    }

    if (fromID > toID)
        throw ['ne']

    let arrPaths = [];
    let existedandPassed = 0;

    for (let id = fromID; id <= toID; id++) {
        const post = listJson.posts.find(p => p.id === id);

        for (let mediaIdx = 0; mediaIdx < post.media.length; mediaIdx++) {
            const isImage = post.media[mediaIdx] === 0
            const localpath = RuntimeDir + `${cat}/${id}-${mediaIdx}.${isImage ? 'jpg' : 'mp4'}`

            if (!fs.existsSync(localpath)) {
                arrPaths.push({
                    localpath,
                    id,
                    mediaIdx
                })
            }
            else
                existedandPassed++;
        }
    }

    if (existedandPassed > 0)
        console.log('existed and passed count:', existedandPassed);

    let resArr;

    if (arrPaths.length > 0) {
        console.log('start pull from ID', fromID, 'to', toID, 'total files need to pull', arrPaths.length);

        resArr = await Promise.all(
            arrPaths.map(item => {
                const fbpath = `${cat}/data/${item.id}/${item.mediaIdx}`

                return firebaseStorage.DownloadAsync(fbpath, item.localpath)})
        )

        resArr.forEach(res => {
            if (res === null)
                return

            console.error(res._baseMessage);
        })
    }

    console.log('done, total file downloaded', resArr ? resArr.filter(res => res === null).length : 0, 'time', Date.now() - startTick);
    console.log('_________________________')
}

module.exports = {
    PullAllAsync,
    PullFileListAsync,
    GetFirebasePath,
}