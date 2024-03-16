import { UniversePicOfDayData } from "../../constants/Types"
import { prependZero } from "../Utils"
import { CreateError, GetTextBetween, RemoveHTMLTags } from "../UtilsTS"

const extract = (text: string, date: Date): UniversePicOfDayData | Error => {
    const lines = text.split('\n')

    let imgUri = undefined // full hd
    let thumbUri = undefined
    let title = undefined
    let explanation = undefined
    let credit = undefined

    for (let i = 0; i < lines.length; i++) {

        if (imgUri && thumbUri && title && explanation && credit) { // success
            break
        }

        let line = lines[i]

        // img uri (first '<a href="image')

        if (line.includes('<a href="image')) {
            if (imgUri) // alrady extracted
                continue

            imgUri = GetTextBetween(line, '"')

            if (!imgUri) {
                return new Error('[GetUniversePicOfDayData] can not extract url between "/"" of line: ' + line)
            }
            else
                imgUri = 'https://apod.nasa.gov/apod/' + imgUri
        }

        // thumb (first '<IMG SRC')

        if (line.includes('<IMG SRC')) {
            if (thumbUri) // alrady extracted
                continue

            thumbUri = GetTextBetween(line, '"')

            if (!thumbUri) {
                return new Error('[GetUniversePicOfDayData] can not extract thumbUri between "/"" of line: ' + line)
            }
            else
                thumbUri = 'https://apod.nasa.gov/apod/' + thumbUri
        }

        // title (first <b>)

        else if (line.includes('<b>') && !line.includes('Explanation:') && !line.includes('Credit')) {
            if (title) // alrady extracted
                continue

            title = GetTextBetween(line, '<b>', '</b>')

            if (!title) {
                return new Error('[GetUniversePicOfDayData] can not extract title between "<b>...</b>" of line: ' + line)
            }
            else
                title = title.trim()
        }

        // explanation

        else if (line.includes('Explanation:')) { // start
            if (explanation) // alrady extracted
                continue

            let s = ''

            for (i = i + 1; i < lines.length; i++) {
                line = lines[i]

                if (line.includes('<p> <center>')) { // end
                    break
                }

                s += line
            }

            explanation = RemoveHTMLTags(s).trim()
        }

        // credit

        else if (line.includes('Credit') && line.includes('<b>')) { // start
            if (credit) // alrady extracted
                continue

            let s = ''

            for (i = i + 1; i < lines.length; i++) {
                line = lines[i]

                if (line.includes('</center>')) { // end
                    break
                }

                s += line
            }

            // console.log(s);
            credit = RemoveHTMLTags(s).trim()

            // console.log(credit);

            const idxSemicolon = credit.indexOf(':')

            if (idxSemicolon > 0 && idxSemicolon < credit.length - 1) {
                credit = credit.substring(idxSemicolon + 1).trim()
            }
        }
    }

    if (!imgUri && !thumbUri) {
        return new Error('[GetUniversePicOfDayData] can not find full img or thumb uri of date: ' + date.toLocaleDateString())
    }

    if (!explanation && !title) {
        return new Error('[GetUniversePicOfDayData] can not find Explantion or Title of date: ' + date.toLocaleDateString())
    }

    return {
        imgUri,
        thumbUri,
        title,
        explanation,
        credit
    } as UniversePicOfDayData
}

export const GetSourceUniverse = (date: Date) => {
    const year = date.getFullYear().toString().substring(2)
    return `https://apod.nasa.gov/apod/ap${year}${prependZero(date.getMonth() + 1)}${prependZero(date.getDate())}.html`
}

export const GetUniversePicOfDayDataAsync = async (date: Date): Promise<UniversePicOfDayData | Error> => {
    try {
        const link = GetSourceUniverse(date)
        // console.log('fetching...', link);

        const response = await fetch(link)

        if (!response.ok)
            return new Error(response.statusText)

        return extract(await response.text(), date)
    } catch (error) {
        return CreateError(error)
    }
}