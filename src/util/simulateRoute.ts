import { Jupiter } from "@jup-ag/core";
import { u64 } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { TbcSuportedToken } from "src/constants/tbcSupportedTokens";
import { JupToken } from "../types/JupToken";
import {
  simulateSrlyToTbcSwap,
  simulateTbcToSrlySwap,
} from "./simulateTbcSwap";

export const simulateTbcInput = async (
  tbcInputToken: TbcSuportedToken,
  jupInputToken: JupToken,
  jupOutputToken: JupToken,
  inputAmount: number,
  slippage: number,
  jupiter: Jupiter,
  connection: Connection
) => {
  const formattedInput = inputAmount / 10 ** tbcInputToken.decimals;
  console.log(
    `Simulating ${formattedInput} ${tbcInputToken.symbol} -> ${jupInputToken.symbol}...`
  );

  const outputAmount = await simulateTbcToSrlySwap(
    tbcInputToken,
    new u64(inputAmount),
    connection
  );

  const formattedOutput =
    outputAmount.toNumber() / 10 ** jupInputToken.decimals;

  console.log("Quote:", formattedOutput, `(${jupInputToken.symbol})`);

  console.log(
    `Getting routes for ${formattedOutput} ${jupInputToken.symbol} -> ${jupOutputToken.symbol}...`
  );

  const routes = await jupiter.computeRoutes({
    inputMint: new PublicKey(jupInputToken.address),
    outputMint: new PublicKey(jupOutputToken.address),
    inputAmount: outputAmount.toNumber(),
    slippage: slippage,
    forceFetch: true,
  });

  if (routes === null) {
    throw new Error("could not calculate any jupiter routes");
  }

  console.log("Possible number of routes:", routes.routesInfos.length);
  console.log(
    "Best jupiter quote:",
    routes.routesInfos[0].outAmount / 10 ** jupOutputToken.decimals,
    `(${jupOutputToken.symbol})`
  );

  return new u64(routes.routesInfos[0].outAmount);
};

export const simulateTbcOutput = async (
  jupInputToken: JupToken,
  jupOutputToken: JupToken,
  tbcOutputToken: TbcSuportedToken,
  inputAmount: number,
  slippage: number,
  jupiter: Jupiter,
  connection: Connection
) => {
  const formattedInput = inputAmount / 10 ** jupInputToken.decimals;
  console.log(
    `Getting routes for ${formattedInput} ${jupInputToken.symbol} -> ${jupOutputToken.symbol}...`
  );

  const routes = await jupiter.computeRoutes({
    inputMint: new PublicKey(jupInputToken.address),
    outputMint: new PublicKey(jupOutputToken.address),
    inputAmount,
    slippage,
    forceFetch: true,
  });

  if (routes === null) {
    throw new Error("could not calculate any jupiter routes");
  }

  const formattedOutput =
    routes.routesInfos[0].outAmount / 10 ** jupOutputToken.decimals;

  console.log("Possible number of jupiter routes:", routes.routesInfos.length);
  console.log(
    "Best jupiter quote:",
    formattedOutput,
    `(${jupOutputToken.symbol})`
  );

  console.log(
    `Simulating ${formattedOutput} ${jupOutputToken.symbol} -> ${tbcOutputToken.symbol}...`
  );

  const outputAmount = await simulateSrlyToTbcSwap(
    tbcOutputToken,
    new u64(routes.routesInfos[0].outAmount),
    connection
  );

  console.log(
    "Quote:",
    outputAmount.toNumber() / 10 ** tbcOutputToken.decimals,
    `(${tbcOutputToken.symbol})`
  );

  return outputAmount;
};
