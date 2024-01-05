const { log } = require("console")
const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './assets/json/top_movies.json'
const source = './editor/top-movies-html.txt'

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

// <a href="/title/
// srcset="
// <span class="sc-43986a27-8 jHYIIK cli-title-metadata-item">
// an class="ipc-rating-star--voteCoun
// class="ipc-html-content-inner-d
const GenDataTopMovies = async () => {
    const text = fs.readFileSync(source, 'utf-8')
    const lines = text.split('\n')

    const arr = []
    let currentItem = undefined

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()

        if (line.includes('srcset=')) {
            i++
            line = lines[i].trim()
            currentItem = {}
            currentItem.thumbnailUri = line.replace(',', '')
        }


        else if (line.includes('<a href="/title/')) {
            if (!currentItem)
                continue

            const title  = GetMiddleText(GetMiddleText(line))
            const dotIdx = title.indexOf('.')

            const rankS = title.substring(0, dotIdx)
            currentItem.title = title.substring(dotIdx + 2)
            currentItem.rank = Number.parseInt(rankS)
        }

        else if (line.includes('</span><span class="sc-43986a27-8 jHYIIK dli-title-metadata-item">')) {
            if (!currentItem)
                continue

            line = line.replaceAll('<span class="sc-43986a27-8 jHYIIK dli-title-metadata-item">', '')
            line = line.replaceAll('</span><span class="sc-43986a27-8 jHYIIK dli-title-metadata-item">', ' ')
            // line = line.replace('</span><span class="sc-43986a27-8 jHYIIK dli-title-metadata-item">', ' ')
            line = line.replace('</span>', '')

            currentItem.info = line

            line = lines[i + 1].trim()
            i++

            const rate = GetMiddleText(line)
            currentItem.info += ' ' + rate

            log(currentItem.title, rate)
        }

        else if (line.includes('class="ipc-rating-star--voteCoun')) {
            if (!currentItem)
                continue

                
            currentItem.rate = line.replaceAll('<span class="ipc-rating-star--voteCount">&nbsp;', ' ')
            currentItem.rate = currentItem.rate.replaceAll('</span>', '')
        }

        else if (line.includes('class="ipc-html-content-inner-d')) {
            if (!currentItem)
                continue

            currentItem.desc = GetMiddleText(line)

            if (!currentItem.desc && !line.includes('</div>')) {
                // LogRed(currentItem.title)

                currentItem.desc = ''

                const maxL = i + 5
                for ( i  = i + 1; i < maxL; i++) {
                    line = lines[i].trim()

                    if (line.includes('</div>'))
                        break

                    currentItem.desc += lines[i].trim() + ' '
                }

                // log(currentItem.desc)
            }

            if (currentItem.thumbnailUri &&
                currentItem.title) { // is valid
                arr.push(currentItem)
                // break
            }
            else {
                // LogRed(JSON.stringify( currentItem))
            }

            currentItem = undefined
        }

    }

    const t = JSON.stringify(arr, null, 1)
    fs.writeFileSync(filepath, t)

    // console.log(t)

    LogGreen('done')
}


module.exports = {
    GenDataTopMovies
}