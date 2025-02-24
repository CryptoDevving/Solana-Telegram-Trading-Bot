"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const swapConfig = {
//   executeSwap: false, // Send tx when true, simulate tx when false
//   useVersionedTransaction: true,
//   tokenAAmount: 0.01, // Swap 0.01 SOL for USDT in this example
//   tokenAAddress: "So11111111111111111111111111111111111111112", // Token to swap for the other, SOL in this case
//   tokenBAddress: "7NgbAAMf3ozg4NG3Ynt2de5TA2afMZZkfkGpEpC2mXYu", // USDC address
//   maxLamports: 1500000, // Micro lamports for priority fee
//   direction: "in" as "in" | "out", // Swap direction: 'in' or 'out'
//   liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
//   maxRetries: 20,
// };
const swapConfig = (tokenBAddress, tokenAAmount) => {
    const formData = {
        executeSwap: false,
        useVersionedTransaction: true,
        tokenAAmount: tokenAAmount,
        tokenAAddress: "So11111111111111111111111111111111111111112",
        tokenBAddress: tokenBAddress,
        maxLamports: 1500000,
        direction: 'in',
        liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
        maxRetiries: 20
    };
    return formData;
};
exports.default = swapConfig;
