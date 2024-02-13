const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './assets/json/my_instants.json'
const source = './editor/my-instants.txt'

const GetMiddleText = (text) => {
    let idx = text.indexOf('>')

    if (idx <= 0)
        return text

    text = text.substring(idx + 1)

    idx = text.indexOf('<')


    if (idx <= 0)
        return text

    return text.substring(0, idx)
}


var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);

const GenMyInstants = async () => {
    const text = fs.readFileSync(source, 'utf-8')
    const lines = text.split('\n')

    const arr = []
    let currentItem = undefined

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()

        let idx = line.indexOf('/media/sounds')
        let idx2 = line.indexOf('.mp3')

        if (idx >= 0 && idx2 >= 0) {
            if (!currentItem)
                currentItem = {}

            currentItem.mp3 = 'https://www.myinstants.com' + line.substring(idx, idx2 + 4)
        }
        else if (line.includes('instant-link link-secondary')) {
            if (!currentItem)
                continue

            currentItem.name = GetMiddleText(line)

            if (currentItem.mp3 &&
                currentItem.name) { // is valid
                arr.push(currentItem)
                // break
            }
            else {
                LogRed('mising info: ' + JSON.stringify(currentItem))
            }

            currentItem = undefined
        }
    }

    const t = JSON.stringify(arr, null, 1)

    // console.log(t);
    fs.writeFileSync(filepath, t)

    console.log('validated all. count ' + arr.length)

    LogGreen('done')
}


module.exports = {
    GenMyInstants
}