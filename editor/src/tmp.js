const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')
const filepath = './assets/json/tmp.txt'

const Tmp = async () => {

    const res = await fetch('https://en.wikipedia.org/wiki/Special:Random')

    fs.writeFileSync(filepath, await res.text())
    LogGreen('done')
}


module.exports = {
    Tmp
}