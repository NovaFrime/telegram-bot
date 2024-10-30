// bot.js
const TelegramBot = require('node-telegram-bot-api');

// Replace with your Bot API Token from BotFather
const token = '7635787035:AAH1ityjRLlqf5dyCuK4nvkDKextVTuUC9Y';
const bot = new TelegramBot(token, { polling: true });
const options = {
    reply_markup: {
        inline_keyboard: [  // Change this from InlineKeyboardButton to inline_keyboard
            [
                {
                    text: "🎰 Play Now!",
                    web_app: { url: "https://4f26-2405-4803-c7e2-6e90-2ca6-3058-ef7c-ad68.ngrok-free.app" } // Corrected the syntax
                },
            ],
        ],
    },
};
// Start command
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome to the Wheel of Fortune bot! Spin to win!", options);
});

// Help command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `
    Here are some commands to get you started:
    - /start: Start the bot
    - /play: Play the Wheel of Fortune game
    - /help: Show this help message
  `);
});

// Play command with a web_app button
bot.onText(/\/play/, (msg) => {
    bot.sendMessage(msg.chat.id, "Click the button below to play the game!", options);
});

// Fallback message
bot.on('message', (msg) => {
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(msg.chat.id, "I didn't understand that. Try /play or /help.");
    }
});
