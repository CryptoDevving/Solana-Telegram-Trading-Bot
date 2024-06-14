const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
import  swapConfig  from './swapRaydium'; // Import the configuration


// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("Bot token is not set in .env");
  process.exit(1);
}
console.log("Bot token:", token);

// Create a new Telegram bot using polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Session state for each chat
const sessions:any = {};

// Define the inline keyboard layout for interaction
const options = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🛒 Buy", callback_data: "buy" }, { text: "📈 Sell", callback_data: "sell" }],
      [{ text: "💼 Help", callback_data: "help" }, { text: "📬 Channel", url: "https://t.me/Maestrosdegen" }]
    ],
  },
};

const selectedBuyOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🛒 Manual Buy", callback_data: "manual_buy" }],
      [{ text: "🚀 Auto Buy", callback_data: "auto_buy" }]
    ],
  },
};

bot.onText(/\/start/, (msg:any) => {
  const chatId = msg.chat.id;
  const welcomeMessage = "🍄 Welcome to my soltank_bot!\n\n`AAEuA3DeoblV-LZQwoexDgWJoM2Tg0-E2Ns                                   `\n\n`https://t.me/mysol_tankbot`\n\n 🥞 Please choose a category below:";
  bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on("callback_query", (callbackQuery:any) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data;
  const chatId = message.chat.id;

  if (!sessions[chatId]) {
    sessions[chatId] = { waitingForAmount: false, waitingForTokenAddress: false };
  }

  if (category === "buy") {
    bot.sendMessage(chatId, "🏆 Choose your buy method:                  ", selectedBuyOptions);
  } else if (category === "manual_buy") {
    sessions[chatId].waitingForAmount = true;
    bot.sendMessage(chatId, "✍ Input the amount you want to buy ...  (sol)     \n⚱️  For example: 1.25                      ");
  } else if (category === "auto_buy") {
    bot.sendMessage(chatId, "✍ Auto buy is not implemented yet.");
  }
});

bot.on("message", (msg:any) => {
  const chatId = msg.chat.id;
  const session = sessions[chatId];

  if (!session) return; // Ignore messages if session isn't initialized

  if (session.waitingForTokenAddress) {
    const tokenAddress = msg.text.trim();
    if (tokenAddress) {
      console.log("Token address:", tokenAddress);
      session.tokenAddress = tokenAddress;
      session.waitingForTokenAddress = false;      
      bot.sendMessage(chatId, `👌 Success! Ready for swap ...                                                 \n\n💰 Amount: ${session.amount.toFixed(6)} SOL           \n🤝 Token Address: ${tokenAddress}`);
      console.log("----***--SwapConfig---***---", swapConfig(tokenAddress, session.amount));
      delete sessions[chatId]; // Clear session after completion
    }
  } else if (session.waitingForAmount) {
    const amount = parseFloat(msg.text);
    if (!isNaN(amount)) {
      session.amount = amount;
      session.waitingForAmount = false;
      session.waitingForTokenAddress = true;
      bot.sendMessage(chatId, "🧧 Input the token address you want to buy ...  (sol)     \n\n⚱️  For example: 7NgbAAMf3ozg4NG3Ynt2de5TA2afMZZkfkGpEpC2mXYu      ");
      
    } else {
      bot.sendMessage(chatId, "Invalid amount. Please enter a valid number.");
    }
  }


});

