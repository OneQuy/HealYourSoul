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

module.exports = {
    GetParam,
    IsParamExist,
    GetParamExcludesDefaults,
}