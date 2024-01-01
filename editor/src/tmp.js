const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './assets/json/Wiki.text'

const Wiki = async () => {

    const res = await fetch('https://en.wikipedia.org/wiki/Special:Random')

    fs.writeFileSync(filepath, await res.text())
    LogGreen('done')
}


module.exports = {
    Wiki
}