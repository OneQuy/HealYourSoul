// const { LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')

const filepath = './editor/jsons/anime_quotes.json'

const source_json = './editor/data_for_generate/anime_quotes_raw.json'

/**
{
    "ID": "8598",
    "Anime": "(Mobile Suit Gundam Seed)",
    "Character": "Kira Yamato",
    "Quote": "What can you protect, if your only weapon are your emotions."
},
 */
const GenAnimeQuotes = async () => {
    const text = fs.readFileSync(source_json, 'utf-8')

    const arrRaw = JSON.parse(text)

    const arr = []

    arrRaw.forEach(element => {
        if (element.Quote && element.Quote.length > 1 ||
            element.Character && element.Character.length > 1 ||
            element.Anime && element.Anime.length > 1) {
                arr.push(`${element.Quote}\n- ${element.Character}\n${element.Anime}`)
            }
    });

    
    fs.writeFileSync(filepath, JSON.stringify(arr))
    
    console.log('DONE. arr.length', arr.length);
}


GenAnimeQuotes()


module.exports = {
    GenAnimeQuotes
}