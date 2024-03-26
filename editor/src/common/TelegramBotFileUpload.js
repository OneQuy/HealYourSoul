const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs');
const { LogGreen, LogRed } = require('../Utils_NodeJS');
const { log } = require('console');

const UploadTelegramBot = async (flp, token, chatId, fileAlias) => {
    if (!fs.existsSync(flp)) {
        LogRed('[UploadTelegramBot] Not found file: ' + flp)
        process.exit()
        return;
    }

    if (!token || token.length <= 20) {
        LogRed('[UploadTelegramBot] token is invalid: ' + token)
        process.exit()
        return;
    }

    // Create a bot that uses 'polling' to fetch new updates

    const bot = new TelegramBot(token, { polling: true });

    const { name: botname } = await bot.getMyName()

    // Listen for any kind of message. There are different kinds of messages.

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, 'Chat:\n\n' + JSON.stringify(msg, null, 1));
    });

    if (!chatId) {
        LogRed('[UploadTelegramBot] Not found chatid="###". Chat anything to bot to get chatid.')

        return;
    }

    console.log(`[UploadTelegramBot] sending file ${fileAlias ?? ''} to bot '${botname}'`)

    if (fileAlias) {
        bot.sendMessage(chatId, fileAlias)
    }

    // Read the file as a stream

    const fileStream = fs.createReadStream(flp);

    // Send the file

    bot.sendDocument(chatId, fileStream)
        .then(() => {
            LogGreen(`[UploadTelegramBot] File sent to bot '${botname}' successfully: ` + flp)
            process.exit()
        })
        .catch((error) => {
            LogRed('[UploadTelegramBot] Error sending file:', error);
            process.exit()
        })
}

module.exports = {
    UploadTelegramBot
}




// bot.on('polling_error', (error) => {
//     console.log('polling_error\n\n' + error);  // => 'EFATAL'
// });



//  // Matches "/echo [whatever]"
//  bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message

//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"

//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });