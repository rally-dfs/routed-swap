import { Connection, Keypair } from "@solana/web3.js";
import fetch from "isomorphic-fetch";

import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
import { ENV, RLY_MINT_ADDRESS, SOLANA_RPC_ENDPOINT } from "./constants";
import { JupToken } from "./types/JupToken";
import { TBC_SUPPORTED_TOKENS } from "./constants/tbcSupportedTokens";
import { simulateTbcInput, simulateTbcOutput } from "./util/simulateRoute";

// Token Mints
// const INPUT_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
// const OUTPUT_MINT_ADDRESS = "8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk"; // GARY
const INPUT_MINT_ADDRESS = "8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk"; // GARY
const OUTPUT_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
const SWAP_INPUT_AMOUNT = 100; // we account for decimals later on, no need to use lamports here
const SWAP_SLIPPAGE = 1; // 1%

const main = async () => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed"); // Setup Solana RPC connection

    //  Load Jupiter
    const jupiter = await Jupiter.load({
      connection,
      cluster: ENV,
      user: Keypair.generate(),
    });

    // Test to see if the input or output tokens are part of our
    // internal whitelist for TBC swaps

    const tbcInputToken = TBC_SUPPORTED_TOKENS.find(
      (t) => t.mintPubkey.toBase58() == INPUT_MINT_ADDRESS
    );
    const tbcOutputToken = TBC_SUPPORTED_TOKENS.find(
      (t) => t.mintPubkey.toBase58() == OUTPUT_MINT_ADDRESS
    );

    // must match at least one of the two to apply to this routing
    if (tbcInputToken === undefined && tbcOutputToken === undefined) {
      throw new Error("No known token bonding curve for input or output token");
    }

    // If both input and output are TBC supported do two TBC swaps
    // in order to go between
    if (tbcInputToken !== undefined && tbcOutputToken !== undefined) {
      // tbc -> rly -> tbc

      return;
    }

    // if only one of the tokens is a TBC supported token lets route
    // the rest of the trade through jupiter

    // fetch the list of jupiter supported tokens
    const jupiterTokens: JupToken[] = await (
      await fetch(TOKEN_LIST_URL[ENV])
    ).json();

    // sRLY is a supported jupiter token, get that.
    const jupRlyToken = jupiterTokens.find(
      (t) => t.address == RLY_MINT_ADDRESS.toBase58()
    );

    if (jupRlyToken === undefined) {
      throw new Error("Could not find jupiter support for sRLY");
    }

    const jupInputToken = jupiterTokens.find(
      (t) => t.address == INPUT_MINT_ADDRESS
    );
    const jupOutputToken = jupiterTokens.find(
      (t) => t.address == OUTPUT_MINT_ADDRESS
    );

    // We have a TBC token and want some other token
    if (tbcInputToken !== undefined && jupOutputToken !== undefined) {
      // tbc -> rly -> jupiter output
      const inputAmountInSmallestUnits = Math.round(
        SWAP_INPUT_AMOUNT * 10 ** jupRlyToken.decimals
      );

      const outputAmount = await simulateTbcInput(
        tbcInputToken,
        jupRlyToken,
        jupOutputToken,
        inputAmountInSmallestUnits,
        SWAP_SLIPPAGE,
        jupiter,
        connection
      );
    }

    // we have some token and we want some TBC token in the end
    if (jupInputToken !== undefined && tbcOutputToken !== undefined) {
      // jupiter input -> rly -> tbc
      const inputAmountInSmallestUnits = Math.round(
        SWAP_INPUT_AMOUNT * 10 ** jupInputToken.decimals
      );

      const outputAmount = await simulateTbcOutput(
        jupInputToken,
        jupRlyToken,
        tbcOutputToken,
        inputAmountInSmallestUnits,
        SWAP_SLIPPAGE,
        jupiter,
        connection
      );
    }

    process.exit(0);
  } catch (error) {
    console.log({ error });
  }
};

main();
