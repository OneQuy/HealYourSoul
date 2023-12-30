const { LogRed } = require("./Utils_NodeJS")

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
    const res = await fetch('https://www.nature.org/en-us/get-involved/how-to-help/photo-contest/2023-winners/')
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

            const rewardtext = GetMiddleText(line)
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

            const t = GetMiddleText(line)
            const arrr = t.split(', ')

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

            currentItem.title = GetMiddleText(line)
            currentItem.description = lines[i + 1].trim()

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

    const t = JSON.stringify(arr, null, 1)

    console.log(t)

}


module.exports = {
    GenDataPictureOfTheYear
}