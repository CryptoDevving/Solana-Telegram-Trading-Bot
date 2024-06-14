import RaydiumSwap from './RaydiumSwap';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
// import { Wallet } from '@coral-xyz/anchor';

const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const node_RPC_URL: any = process.env.RPC_URL;
const Wallet_private_key: any = process.env.WALLET_PRIVATE_KEY;

//Assign formData
let formData:any = {
  executeSwap: false,
  useVersionedTransaction: true,
  tokenAAmount: 0.00,
  tokenAAddress: "So11111111111111111111111111111111111111112",
  tokenBAddress: "8MgbAAMf3ozg4NG3Ynt2de5TA2afMZZkfkGpEpC2mXYu",
  maxLamports: 1500000,
  direction: 'in',
  liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
  maxRetiries: 20
};

//Set up swapConfig data
const swapConfig = (tokenBAddress: string, tokenAAmount: number) => {
  formData = {
    executeSwap: false,
    useVersionedTransaction: true,
    tokenAAmount: tokenAAmount,
    tokenAAddress: "So11111111111111111111111111111111111111112",
    tokenBAddress: tokenBAddress,
    maxLamports: 1500000,
    direction: 'in',
    liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
    maxRetiries: 20
  }
  swap(formData);
  return formData;
}

export default swapConfig;

/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const swap = async (formData:any) => {
  /**
   * The RaydiumSwap instance for handling swaps.
   */
  console.log(`RPC_URL... ${node_RPC_URL}........ WALLET_PRIVATE_KEY... ${Wallet_private_key}`);
  const raydiumSwap = new RaydiumSwap(node_RPC_URL, Wallet_private_key);
  console.log(`Raydium swap initialized`);
  console.log(`Swapping ${formData} of ${formData.tokenAAddress} for ${formData.tokenBAddress}...`)

  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */
  await raydiumSwap.loadPoolKeys(formData.liquidityFile);
  console.log(`Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(formData.tokenAAddress, formData.tokenBAddress);
  if (!poolInfo) {
    console.error('Pool info not found');
    return 'Pool info not found';
  } else {
    console.log('Found pool info');
  }

  /**
   * Prepare the swap transaction with the given parameters.
   */
  const tx = await raydiumSwap.getSwapTransaction(
    formData.tokenBAddress,
    formData.tokenAAmount,
    poolInfo,
    formData.maxLamports, 
    formData.useVersionedTransaction,
    formData.direction
  );

  console.log("tx", tx);

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (formData.executeSwap) {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const txid = formData.useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(tx as VersionedTransaction, formData.maxRetries)
      : await raydiumSwap.sendLegacyTransaction(tx as Transaction, formData.maxRetries);

    console.log(`https://solscan.io/tx/${txid}`);

  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = formData.useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(tx as VersionedTransaction)
      : await raydiumSwap.simulateLegacyTransaction(tx as Transaction);

    console.log(simRes);
  }
};


