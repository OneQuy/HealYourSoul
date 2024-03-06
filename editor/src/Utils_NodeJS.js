// https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors:~:text=Eclipse%20Terminal-,30,-40
function LogRed(...msg) {
    const code = process.platform === 'win32' ? 91 : 31

    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

function LogGreen(...msg) {
    const code = process.platform === 'win32' ? 92 : 32
    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

function LogYellow(...msg) {
    const code = process.platform === 'win32' ? 93 : 33
    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

/**
 * function SplitSectionsFromText(wholeTxt: string): string[][]
*/
function SplitSectionsFromText(wholeTxt) {
    const lines = wholeTxt.split('\n')

    const arrRes= []
    let curElement= undefined

    for (let iline = 0; iline < lines.length; iline++) {
        const lineTrim = lines[iline].trim()

        if (!lineTrim) {
            curElement = undefined
            continue
        }

        if (!curElement) {
            curElement = []
            arrRes.push(curElement)
        }

        curElement.push(lineTrim)
    }

    return arrRes
}

module.exports = {
    LogRed,
    LogGreen,
    LogYellow,

    SplitSectionsFromText,
}