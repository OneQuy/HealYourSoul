const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')
const filepath = './assets/json/tmp.txt'

const Tmp = async () => {

    // const res = await fetch('https://www.imdb.com/chart/top/?ref_=nv_mv_250')

    // fs.writeFileSync(filepath, await res.text())
    // LogGreen('done')

    Gen_movie_quotes_raw()
}

const Gen_movie_quotes_raw = async () => {
    const source_json = './editor/movie_quotes_raw.json'
    const destPath = './editor/jsons/movie_quotes.json'

    const text = fs.readFileSync(source_json, 'utf-8')

    const rawarr = JSON.parse(text)

    const arr = []

    rawarr.forEach(element => {
        arr.push(`${element.quote}\n\n(${element.movie}, ${element.year})`)
    });

    // console.log(arr);

    fs.writeFileSync(destPath, JSON.stringify(arr, null, 1))
    LogGreen('done')
}


module.exports = {
    Tmp
}