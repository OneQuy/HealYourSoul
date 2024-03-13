const { LogRed, LogGreen } = require("./Utils_NodeJS")

const fs = require('fs')
const filepath = './editor/jsons/DogBreeds.json'

const source_json = './editor/dog_breeds.json'

const GenDogBreeds = async () => {

    const text = fs.readFileSync(source_json, 'utf-8')

    const obj = JSON.parse(text)

    const entries = Object.entries(obj)

    const arr = []

    entries.forEach(element => {
        if (Array.isArray(element[1]) && element[1].length > 0) {
            element[1].forEach(sub => {
                arr.push(element[0] + '/' + sub)
            });
        }
        else 
            arr.push(element[0])
    });

    console.log(arr);
    
    fs.writeFileSync(filepath, JSON.stringify(arr))
    LogGreen('done')
}


module.exports = {
    GenDogBreeds
}