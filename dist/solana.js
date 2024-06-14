"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
// Implement Solana-related functions here
// Respond to the callback query with an alert and update the bot's message
//   bot.answerCallbackQuery(callbackQuery.id, {
//     text: `You pressed ${category}`,
//     show_alert: true,
//   });
