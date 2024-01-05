const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')
const filepath = './assets/json/tmp.txt'

const Tmp = async () => {

    const res = await fetch('https://www.imdb.com/chart/top/?ref_=nv_mv_250')

    fs.writeFileSync(filepath, await res.text())
    LogGreen('done')
}


module.exports = {
    Tmp
}