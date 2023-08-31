// https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors:~:text=Eclipse%20Terminal-,30,-40
function LogRed(msg) {
    console.log(`\x1b[31m ${msg} \x1b[0m`);
}

module.exports = {
    LogRed
}