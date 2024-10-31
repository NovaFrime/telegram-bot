const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const dotenv = require('dotenv');
const express = require('express');


dotenv.config();

const shareLink = process.env.TELEGRAM_SHARE_LINK;
const gameLink = process.env.TELEGRAM_GAME_LINK; 
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const app = express();

const play_options = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "🎰 Play Now!",
                    web_app: { url: gameLink }
                },
                {
                    text: "📈 Check Stats",
                    callback_data: 'stats' 
                },
            ],
            [
                {
                    text: "💬 Share with Friends",
                    callback_data: 'share_link' 
                },
                {
                    text: "🔄 Refresh",
                    callback_data: 'refresh' 
                },
            ],
            [
                {
                    text: "❔ FAQ & Help",
                    callback_data: 'faq_help' 
                },
                
            ]
        ],
    },
};
const help_options = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Bạn muốn nhận quà bằng cách nào?",
                    callback_data: 'nhanqua' 
                },
                {
                    text: "Quy đổi phẩn thưởng như thế nào?",
                    callback_data: 'doithuong' 
                },
            ],
        ],
    },
};

const nhanqua_options = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Telegram",
                    callback_data: 'nhanqua_telegram'
                },
                {
                    text: "Facebook",
                    callback_data: 'nhanqua_facebook'
                },
            ],
        ],
    },
};

const doithuong_options = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Telegram",
                    callback_data: 'doithuong_telegram'
                },
                {
                    text: "Facebook",
                    callback_data: 'doithuong_facebook'
                },
            ],
        ],
    },
};

let groupChatIds = [];


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Click below to play the game!", play_options);
});


bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `
    Here are some commands to get you started:
    - /start: Start the bot
    - /play: Play the Wheel of Fortune game
    - /help: Show this help message
    - /share: Get the message to share the bot with your friends!
  `);
});


bot.onText(/\/play/, (msg) => {
    bot.sendMessage(msg.chat.id, "Click the button below to play the game!", play_options);
});



cron.schedule('0 10 * * *', () => {
    groupChatIds.forEach(chatId => {
        bot.sendMessage(chatId, "Don't forget to share the Wheel of Fortune bot with your friends!", play_options);
    });
});


bot.on('new_chat_members', (msg) => {
    msg.new_chat_members.forEach(member => {
        if (member.id === bot.id) {
            if (!groupChatIds.includes(msg.chat.id)) {
                groupChatIds.push(msg.chat.id);
            }
        }
    });
});


bot.on('left_chat_member', (msg) => {
    if (msg.left_chat_member.id === bot.id) {
        groupChatIds = groupChatIds.filter(id => id !== msg.chat.id);
    }
});


bot.on('message', (msg) => {
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(msg.chat.id, "I didn't understand that. Try /play or /help.");
    }
});


bot.on("callback_query", (callbackQuery) => {
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    switch (data) {
        case 'faq_help':
            bot.sendMessage(userId, "Bạn muốn hỏi gì ?", help_options);
            break;
        case 'share_link':
            bot.sendMessage(userId, "Share below message!");
            bot.sendMessage(userId, `Play Wheel of Fortune here to earn real life prizes!!! JOIN NOW: ${shareLink}`);
            break;
        case 'stats':
            bot.sendMessage(userId, "Here are your game stats!");
            break;
        case 'refresh':
            bot.sendMessage(userId, "Refreshing your game data...", play_options);
            break;
        case 'nhanqua':
            bot.sendMessage(userId, "Chọn nền tảng để nhận quà:", nhanqua_options);
            break;
        case 'doithuong':
            bot.sendMessage(userId, "Chọn nền tảng để đổi thưởng:", doithuong_options);
            break;
        case 'nhanqua_telegram':
            bot.sendMessage(userId, "Bạn đã chọn nhận quà qua Telegram, hãy liên hệ hỗ trợ viên để nhận quà!");
            break;
        case 'nhanqua_facebook':
            bot.sendMessage(userId, "Bạn đã chọn nhận quà qua Facebook, hãy nhắn cho page để nhận quà!");
            break;
        case 'doithuong_telegram':
            bot.sendMessage(userId, "Bạn đã chọn đổi thưởng qua Telegram, hãy liên hệ hỗ trợ viên để đổi thưởng!");
            break;
        case 'doithuong_facebook':
            bot.sendMessage(userId, "Bạn đã chọn đổi thưởng qua Facebook, hãy nhắn cho page để đổi thưởng!");
            break;
        default:
            bot.sendMessage(userId, "I didn't understand that. Try /play or /help.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
