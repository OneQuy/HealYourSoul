const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs');
const { LogGreen, LogRed } = require('../Utils_NodeJS');

const UploadTelegramBot = async (token, flp, chatId, fileAlias) => {
    if (!token) {
        LogRed('[UploadTelegramBot] Token is undefined')
        process.exit()
    }

    // Create a bot that uses 'polling' to fetch new updates

    const bot = new TelegramBot(token, { polling: true });

    bot.on('polling_error', (error) => {
        const msg = error?.message

        if (msg === 'ETELEGRAM: 401 Unauthorized')
            LogRed('[UploadTelegramBot] Maybe your token is invalid. ' + error)
        else
            LogRed('[UploadTelegramBot] Polling error. ' + error)

        process.exit()
    });

    const { name: botname } = await bot.getMyName()

    // Listen for any kind of message. There are different kinds of messages.

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, 'Chat ID: ' + chatId);

        // bot.sendMessage(chatId, 'Chat:\n\n' + JSON.stringify(msg, null, 1));
    });

    if (!chatId) {
        LogRed(`[UploadTelegramBot] Invalid chatId. Chat anything to the bot '${botname}' to get it.`)

        return;
    }

    if (!fs.existsSync(flp)) {
        LogRed('[UploadTelegramBot] Not found file: ' + flp)
        process.exit()
    }

    console.log(`[UploadTelegramBot] Sending file ${fileAlias ?? ''} to bot '${botname}'`)

    if (fileAlias) {
        bot.sendMessage(chatId, fileAlias)
    }

    // Read the file as a stream

    const fileStream = fs.createReadStream(flp);

    // Send the file

    bot.sendDocument(chatId, fileStream)
        .then(() => {
            LogGreen(`[UploadTelegramBot] File sent to bot '${botname}' successfully: ${fileAlias ?? flp}`)
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