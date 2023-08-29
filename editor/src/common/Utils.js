function IsParamExist(key) {
    return typeof GetParam(key) === 'string'
}

function GetParam(key, asStringOrNumber) {
    const p = process.argv.find(param => param.toLowerCase().startsWith(key.toLowerCase()))

    if (!p)
        return undefined;

    const res = p.substring(key.length + 1)

    if (asStringOrNumber === undefined || asStringOrNumber === true)
        return res
    else
        return Number.parseFloat(res)
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