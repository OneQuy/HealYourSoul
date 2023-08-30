function IsParamExist(key) {
    return typeof GetParam(key) === 'string'
}

function GetParam(key, asStringOrNumber) {
    let value
    key = key.toLowerCase()

    for (let i = 0; i < process.argv.length; i++) {
        const param = process.argv[i]
        const paramLower = param.toLowerCase()

        if (paramLower.startsWith(key + '=')) {
            value = param.substring(key.length + 1)
            break
        }
        else if (key === paramLower) {
            value = ''
            break
        }
    }

    if (value === undefined) // not found
        return undefined;

    if (asStringOrNumber === undefined || asStringOrNumber === true) // return as string
        return value
    else // return as number
        return Number.parseFloat(value)
}

function GetParamExcludesDefaults(excludeKey) {
   for (let i = 0; i < process.argv.length; i++) {
        const cur = process.argv[i].toLowerCase()

        if (cur.includes('.js') ||
            cur.includes('node') ||
            cur === excludeKey)
            continue
        
        return cur;
   }
}

function ArrayBufferToBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function GetFileExtensionByFilepath(filepath) {
    var dotIdx = filepath.lastIndexOf('.');

    if (dotIdx == -1)
        return '';

    return filepath.substring(dotIdx + 1, filepath.length);
}

module.exports = {
    GetParam,
    IsParamExist,
    GetParamExcludesDefaults,
    ArrayBufferToBuffer,
    GetFileExtensionByFilepath
}