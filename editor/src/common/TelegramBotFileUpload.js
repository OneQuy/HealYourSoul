const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs');

/**
 ## Usage:
 ```tsx
 UploadTelegramBot("6400751952:AAFL0L9Mk3vJMpfGSTIg", "E:\folder\file.txt", "1978471835", "alias.txt")
 ```
 * @param {*} token How to get token: create bot using @BotFather.
 * @param {*} filepath full local file path.
 * @param {*} chatId How to get chatId: run UploadTelegramBot(yourToken, undefined, undefined, undefined). Then chat anything in the bot to get it.
 * @param {*} fileAlias (optianal) The text msg will be showed before the file uploaded.
 */
const UploadTelegramBot = async (token, filepath, chatId, fileAlias) => {
    if (!token) {
        console.error('[UploadTelegramBot] Token is undefined')
        process.exit()
    }

    // Create a bot that uses 'polling' to fetch new updates

    const bot = new TelegramBot(token, { polling: true });

    bot.on('polling_error', (error) => {
        const msg = error?.message

        if (msg === 'ETELEGRAM: 401 Unauthorized')
            console.error('[UploadTelegramBot] Maybe your token is invalid. ' + error)
        else
            console.error('[UploadTelegramBot] Polling error. ' + error)

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
        console.error(`[UploadTelegramBot] Invalid chatId. Chat anything to the bot '${botname}' to get it.`)

        return;
    }

    if (!fs.existsSync(filepath)) {
        console.error('[UploadTelegramBot] Not found file: ' + filepath)
        process.exit()
    }

    console.log(`[UploadTelegramBot] Sending file ${fileAlias ?? ''} to bot '${botname}'`)

    if (fileAlias) {
        bot.sendMessage(chatId, fileAlias)
    }

    // Read the file as a stream

    const fileStream = fs.createReadStream(filepath);

    // Send the file

    bot.sendDocument(chatId, fileStream)
        .then(() => {
            console.log(`[UploadTelegramBot] File sent to bot '${botname}' successfully: ${fileAlias ?? filepath}`)
            process.exit()
        })
        .catch((error) => {
            console.error('[UploadTelegramBot] Error sending file:', error);
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