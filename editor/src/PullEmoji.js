const { LogRed, LogGreen } = require('./Utils_NodeJS')
const { DownloadFileAsync } = require('./common/FileUtils')

// const minID = 1
// const maxID = 182

const minID = 182
const maxID = 182

const PullAllRelativesOfEmojiAsync = async (id) => {
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

    for (let i = 0; i <= resArr.length; i++) {
        if (resArr[i] === undefined)
            continue

        LogRed('fail: ' + arrUrls[i] + ', error: ' + resArr[i])
    }

    LogGreen('done, ' + (Date.now() - d) + 'ms', dest)
}


const PullEmoji = () => {
    PullAllRelativesOfEmojiAsync(1)
}

module.exports = {
    PullEmoji
}
