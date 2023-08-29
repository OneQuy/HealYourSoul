const fs = require('fs')

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

module.exports = { 
    CheckAndMkDirOfFilepathjAsync 
}