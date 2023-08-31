// https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors:~:text=Eclipse%20Terminal-,30,-40
function LogRed(...msg) {
    console.log(`\x1b[31m ${msg.join(', ')} \x1b[0m`);
}

function LogGreen(...msg) {
    console.log(`\x1b[32m ${msg.join(', ')} \x1b[0m`);
}

function LogYellow(...msg) {
    console.log(`\x1b[33m ${msg.join(', ')} \x1b[0m`);
}

module.exports = {
    LogRed,
    LogGreen,
    LogYellow,
}