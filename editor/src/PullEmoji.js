const { LogRed, LogGreen } = require('./Utils_NodeJS')
const { DownloadFileAsync } = require('./common/FileUtils')

const MIN = 1
const MAX = 182

const TRUNK = 50

const PullAllSingleEmoji = async () => {
    const d = Date.now()

    const arrUrls = []

    const minID = 113
    const maxID = 182

    for (let i = minID; i <= maxID; i++) {
        const path = `https://emojimix.app/emojimixfusion/a${i}.png`
        arrUrls.push(path)

        console.log(path);
    }

    const dest = './editor/other_data/emoji_mix/singles/'

    const resArr = await Promise.all(arrUrls.map(url => {
        const fileNameIdx = url.lastIndexOf('/')

        return DownloadFileAsync(url, dest + (url.substring(fileNameIdx + 1)))
    }))

    let countError = 0

    for (let i = 0; i <= resArr.length; i++) {
        if (resArr[i] === undefined)
            continue

        countError++
        LogRed('error: ' + resArr[i])
    }

    LogGreen('done, ' + (Date.now() - d) + 'ms', minID, maxID, dest)

    return countError
}

const PullMixOfEmojiTrunkAsync = async (id, minID, maxID) => {
    const d = Date.now()

    const arrUrls = []

    for (let i = minID; i <= maxID; i++) {
        arrUrls.push(`https://emojimix.app/emojimixfusion/${id}_${i}.png`)

        // console.log(`https://emojimix.app/emojimixfusion/${id}_${i}.png`)
    }

    const dest = './editor/other_data/emoji_mix/' + id + '_x/'

    const resArr = await Promise.all(arrUrls.map(url => {
        const fileNameIdx = url.lastIndexOf('/')

        return DownloadFileAsync(url, dest + (url.substring(fileNameIdx + 1)))
    }))

    let countError = 0

    for (let i = 0; i <= resArr.length; i++) {
        if (resArr[i] === undefined)
            continue

        countError++
        // LogRed('error: ' + resArr[i])
    }

    // LogGreen('done, ' + (Date.now() - d) + 'ms', minID, maxID, dest)

    return countError
}

const PullEmojiAllAsync = async () => {
    for (let i = 11; i <= 20; i++)
        await PullMixOfEmojiAsync(i)

    // PullAllSingleEmoji()
}

const PullMixOfEmojiAsync = async (id) => {
    let countError = 0

    for (let i = MIN; i <= MAX; i += TRUNK) {

        countError += await PullMixOfEmojiTrunkAsync(id, i, Math.min(i + TRUNK - 1, MAX))
    }

    if (countError > 0)
        LogRed(id + ' error: ' + countError)
    else
        LogGreen(id + 'success all')
}

module.exports = {
    PullEmojiAllAsync
}
