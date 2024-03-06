const { LogRed, LogGreen, SplitSectionsFromText } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './assets/json/top_movies.json'
const source_html = './editor/top-movies-html.txt'
const source_txt = './editor/movies.txt'


const rates = ['R', 'PG-13', 'Approved', 'Not Rate', 'PG']


// const GetMiddleText = (text) => {
//     let idx = text.indexOf('>')

//     if (idx <= 0)
//         return text

//     text = text.substring(idx + 1)

//     idx = text.indexOf('<')


//     if (idx <= 0)
//         return text

//     return text.substring(0, idx)
// }

const GenThumbUrlOf250Movies = () => {
    const text = fs.readFileSync(source_html, 'utf-8')
    const lines = text.split('\n')

    const arr = []

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()

        if (line.includes('srcset=')) {
            i++
            line = lines[i].trim()
            arr.push(line.replace(',', ''))
        }
    }

    return arr;
}

/**
  [
    'Tim Robbins in The Shawshank Redemption (1994)',
    '1. The Shawshank Redemption',
    '1994',
    '2h 22m',
    'R',
    '9.3',
    '(2.9M)'
  ],
  [
    'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
    'DirectorFrank DarabontStarsTim RobbinsMorgan FreemanBob Gunton',
    'Votes2,866,429',
    'Marlon Brando in The Godfather (1972)',
    '2. The Godfather',
    '1972',
    '2h 55m',
    'R',
    '9.2',
    '(2M)'
  ],    
 */
const GenMovieFromSession = (session, nextSession) => {
    const currentItem = {}

    var descOnNextSession = nextSession && nextSession.length > 0 ? nextSession[0] : undefined

    if (descOnNextSession) {
        currentItem.desc = descOnNextSession
        nextSession[0] = ''
    }

    for (let i = 0; i < session.length; i++) {
        var line = session[i]

        if (!line || !line.trim())
            continue;

        if (line.startsWith('Director') || line.startsWith('Votes')) {

            continue;
        }

        var isRateLine = rates.includes(line)

        if (isRateLine) { // rate (info)
            if (!currentItem.info)
                currentItem.info = '' + line
            else
                currentItem.info += ' • ' + line


            continue
        }

        var rankAndTitleIdx = line.indexOf('. ')
        var nextLine = i + 1 < session.length ? session[i + 1] : undefined

        if (rankAndTitleIdx >= 1 && rankAndTitleIdx <= 3) { // title & rank // '211. The Godfather'         
            try {
                currentItem.rank = Number.parseInt(line.substring(0, rankAndTitleIdx))
                currentItem.title = line.substring(rankAndTitleIdx + 2)
            }
            catch {
                LogRed('can not get rank & title of this session: ' + session);
            }
        }

        //  '1972',
        else if (line.length === 4 && !Number.isNaN(Number.parseInt(line))) { // year (info)
            if (!currentItem.info)
                currentItem.info = line
            else
                currentItem.info += ' • ' + line


        }

        // '2h 55m'
        else if (line.length <= 7 && (line.includes('h') || line.includes('m'))) { // duration (info)
            if (!currentItem.info)
                currentItem.info = '' + line
            else
                currentItem.info += ' • ' + line


        }

        // '9.2',
        // '(2M)'
        else if (!Number.isNaN(Number.parseInt(line[0])) && nextLine && nextLine.includes('(') && nextLine.includes(')')) { // rate        
            currentItem.rate = line + ' ' + nextLine

            // session[i + 1] = ''
        }
    }

    if (currentItem.desc &&
        currentItem.rank > 0 &&
        currentItem.info &&
        currentItem.rate &&
        currentItem.title) { // is valid
        return currentItem
    }
    else {
        LogRed('can not extract info of movie: ' + JSON.stringify(session))
        return undefined
    }
}

const GenDataTopMovies = () => {
    const thumbUriArr = GenThumbUrlOf250Movies()

    if (thumbUriArr.length !== 250) {
        LogRed('not enough 250 thumb uri!!!')
        return
    }

    const text = fs.readFileSync(source_txt, 'utf-8')

    const arr = []

    const sessions = SplitSectionsFromText(text)

    for (let i = 0; i < sessions.length; i++) {
        const mov = GenMovieFromSession(sessions[i], i + 1 < sessions.length ? sessions[i + 1] : undefined)

        if (mov) {
            mov.thumbnailUri = thumbUriArr[i]
            arr.push(mov)
        }

        if (arr.length === 250)
            break
    }

    if (arr.length !== 250) {
        LogRed('not enough 250 movies!!!')
        return
    }

    const t = JSON.stringify(arr, null, 1)

    fs.writeFileSync(filepath, t)

    LogGreen('done. validated all. enough 250 movies!')
}

module.exports = {
    GenDataTopMovies
}