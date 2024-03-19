const fs = require('fs')
const https = require('https');
const http = require('https');

/**
 * @param filePath can rlp or flp
 * @returns null if success, otherwise error
 */
async function CheckAndMkDirOfFilepathjAsync(filePath) {
    try {
        var idx = filePath.lastIndexOf('/');

        if (idx < 0)
            throw 'can not CheckAndMkDirOfFilepathAsync of filepath: ' + filePath

        var dirPath = filePath.substring(0, idx);
        var dirIsExist = fs.existsSync(dirPath)

        if (dirIsExist)
            return null;

        const promise = new Promise(rel => {

            fs.mkdir(dirPath, { recursive: true }, (e) => {
                rel(e)
            });
        })

        return await promise;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {*} destPath can be both rlp and flp
 * @returns undefined if success, otherwise new Error()
 */
const DownloadFileAsync = async (url, destPath) => {
    const resMkDir = await CheckAndMkDirOfFilepathjAsync(destPath)

    if (resMkDir !== null)
        return resMkDir

    const httpCommon = (url.startsWith('https') ? https : http)
    let error

    const funcAsync = new Promise((resolve, reject) => {
        httpCommon.get(url, response => {
            const statusCode = response.statusCode;

            if (statusCode !== 200) {
                return reject(new Error(`Download error code: ${response.statusCode}\nFile Url: ${url}\nError msg: ${response.statusMessage}`));
            }

            const writeStream = fs.createWriteStream(destPath);
            response.pipe(writeStream);

            writeStream.on('error', () => reject(new Error(`Download success but fail to write file.\nFile Url: ${url}\nLocal path: ${destPath}`)));
            writeStream.on('finish', () => writeStream.close(resolve));
        });
    }).catch(err => error = err)

    await funcAsync

    return error
}

module.exports = {
    CheckAndMkDirOfFilepathjAsync,
    DownloadFileAsync,
}