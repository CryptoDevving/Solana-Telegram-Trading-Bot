"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RaydiumSwap_1 = __importDefault(require("./RaydiumSwap"));
const swapConfig_1 = __importDefault(require("./swapConfig")); // Import the configuration
// import { Wallet } from '@coral-xyz/anchor';
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();
const node_RPC_URL = process.env.RPC_URL;
const Wallet_private_key = process.env.WALLET_PRIVATE_KEY;
/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const swap = async () => {
    /**
     * The RaydiumSwap instance for handling swaps.
     */
    console.log(`RPC_URL... ${node_RPC_URL}........ WALLET_PRIVATE_KEY... ${Wallet_private_key}`);
    const raydiumSwap = new RaydiumSwap_1.default(node_RPC_URL, Wallet_private_key);
    console.log(`Raydium swap initialized`);
    console.log(`Swapping ${swapConfig_1.default} of ${(0, swapConfig_1.default)("7NgbAAMf3ozg4NG3Ynt2de5TA2afMZZkfkGpEpC2mXYu", 0.0012).tokenAAddress} for ${swapConfig_1.default.tokenBAddress}...`);
    /**
     * Load pool keys from the Raydium API to enable finding pool information.
     */
    await raydiumSwap.loadPoolKeys(swapConfig_1.default.liquidityFile);
    console.log(`Loaded pool keys`);
    /**
     * Find pool information for the given token pair.
     */
    const poolInfo = raydiumSwap.findPoolInfoForTokens(swapConfig_1.default.tokenAAddress, swapConfig_1.default.tokenBAddress);
    if (!poolInfo) {
        console.error('Pool info not found');
        return 'Pool info not found';
    }
    else {
        console.log('Found pool info');
    }
    /**
     * Prepare the swap transaction with the given parameters.
     */
    const tx = await raydiumSwap.getSwapTransaction(swapConfig_1.default.tokenBAddress, swapConfig_1.default.tokenAAmount, poolInfo, swapConfig_1.default.maxLamports, swapConfig_1.default.useVersionedTransaction, swapConfig_1.default.direction);
    console.log("tx", tx);
    /**
     * Depending on the configuration, execute or simulate the swap.
     */
    if (swapConfig_1.default.executeSwap) {
        /**
         * Send the transaction to the network and log the transaction ID.
         */
        const txid = swapConfig_1.default.useVersionedTransaction
            ? await raydiumSwap.sendVersionedTransaction(tx, swapConfig_1.default.maxRetries)
            : await raydiumSwap.sendLegacyTransaction(tx, swapConfig_1.default.maxRetries);
        console.log(`https://solscan.io/tx/${txid}`);
    }
    else {
        /**
         * Simulate the transaction and log the result.
         */
        const simRes = swapConfig_1.default.useVersionedTransaction
            ? await raydiumSwap.simulateVersionedTransaction(tx)
            : await raydiumSwap.simulateLegacyTransaction(tx);
        console.log(simRes);
    }
};
swap();
