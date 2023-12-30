const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './assets/json/photos_of_the_year.json'


const NormalText = (text) => {
    text = text.replaceAll('&#39;', '\'')
    text = text.replaceAll('&#34;', '"')
    text = text.replaceAll('&amp;', '&')

    if (text.includes('&#'))
        LogRed(text)

    return text
}

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

// imageUri *
// reward *
// author
// country
// category
// title
// desciption

const GenDataPictureOfTheYear = async () => {
    const arr = []

    for (let year = 2019; year <= new Date().getFullYear(); year++) {
        const list = await GenDataPictureOfTheYear_ByYear(year)

        if (!list || list.length === 0)
            continue

        arr.push({
            year,
            list
        })

        console.log(year, 'list of ' + list.length);
    }

    const text = JSON.stringify(arr, null, 1)

    fs.writeFileSync(filepath, text)
    LogGreen('done')
}

const GenDataPictureOfTheYear_ByYear = async (year) => {
    const res = await fetch(`https://www.nature.org/en-us/get-involved/how-to-help/photo-contest/${year}-winners/`)
    const text = await res.text()
    const lines = text.split('\n')

    const arr = []
    let currentItem = undefined

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.includes('<h3') ||
            line.includes('<h2')) {
            // arr.push('\n\n')
            // arr.push('REWARD: ' + GetMiddleText(line))

            currentItem = {}

            const rewardtext = NormalText(GetMiddleText(line))
            const arrr = rewardtext.split(', ')

            currentItem.reward = arrr[0]
            currentItem.category = arrr.length === 2 ? arrr[1] : undefined
        }

        else if (line.includes('<p ') &&
            !line.includes('p class="c-immersive') &&
            !line.includes('back to') &&
            !line.includes('<i>')
        ) {
            // arr.push('AUTHOR: ' + GetMiddleText(line))

            if (!currentItem)
                continue

            const t = NormalText(GetMiddleText(line))
            let arrr = t.split(', ')

            if (arrr.length < 2)
                arrr = t.split(' - ')

            currentItem.author = arrr[0]
            currentItem.country = arrr.length === 2 ? arrr[1] : undefined
        }

        else if (line.includes('https://natureconservancy-h.assetsadobe.com/is/image')) {
            // arr.push(line)

            if (!currentItem)
                continue

            if (currentItem.imageUri)
                continue

            let t = line.substring(line.indexOf('http'))
            let idx = t.indexOf('?')

            if (idx < 0) {
                LogRed('fail uri: ' + JSON.stringify(currentItem))
                continue
            }

            const url = t.substring(0, idx) + '?wid=1280'

            currentItem.imageUri = url
        }

        else if (line.includes('<strong')) {
            // arr.push('TITLE: ' + GetMiddleText(line))
            // arr.push(lines[i + 1])
            // i++

            if (!currentItem)
                continue

            currentItem.title = NormalText(GetMiddleText(line))
            currentItem.description = NormalText(lines[i + 1]).trim()

            i++

            if (currentItem.imageUri &&
                currentItem.reward) { // is valid
                arr.push(currentItem)
            }
            else {
                // LogRed(JSON.stringify( currentItem))
            }

            currentItem = undefined
        }
    }

    return arr

    // const t = JSON.stringify(arr, null, 1)

    // console.log(t)
}


module.exports = {
    GenDataPictureOfTheYear
}