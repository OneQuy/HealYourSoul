import { LogRed } from "../../../editor/src/Utils_NodeJS"
import { UniversePicOfDayData } from "../../constants/Types"
import { prependZero } from "../Utils"
import { CreateError, GetTextBetween, RemoveHTMLTags } from "../UtilsTS"

const extract = (text: string, date: Date): UniversePicOfDayData | Error => {
    const lines = text.split('\n')

    let imgUri = undefined
    let title = undefined
    let explanation = undefined
    let credit = undefined

    for (let i = 0; i < lines.length; i++) {

        let line = lines[i]
        // console.log(line);

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

        else if (line.includes('Credit') && line.includes(':') && line.includes('<b>')) { // start
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

            credit = RemoveHTMLTags(s).trim()
        }
    }

    if (!imgUri) {
        return new Error('[GetUniversePicOfDayData] can not find img uri of date: ' + date.toLocaleDateString())
    }

    if (!explanation && !title) {
        return new Error('[GetUniversePicOfDayData] can not find Explantion or Title of date: ' + date.toLocaleDateString())
    }

    return {
        imgUri,
        title,
        explanation,
        credit
    }
}

export const GetUniversePicOfDayDataAsync = async (date: Date): Promise<UniversePicOfDayData | Error> => {
    try {
        const year = date.getFullYear().toString().substring(2)

        const link = `https://apod.nasa.gov/apod/ap${year}${prependZero(date.getMonth() + 1)}${prependZero(date.getDate())}.html`
        console.log('fetching...', link);

        const response = await fetch(link)

        if (!response.ok)
            return new Error(response.statusText)

        return extract(await response.text(), date)
    } catch (error) {
        return CreateError(error)
    }
}