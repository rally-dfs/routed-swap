import { AccountLayout, Token, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SimulatedTransactionAccountInfo,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ORCA_POOL_OWNER,
  ORCA_POOL_SRLY_TOKEN_ACCOUNT,
  SIMULATION_ACCOUNT_OWNER,
  SIMULATION_SRLY_TOKEN_ACCOUNT,
} from "../constants";
import { TbcSuportedToken } from "../constants/tbcSupportedTokens";
import { decodeTokenAccount } from "./decodeTokenAccount";
import { getTbcSwapIx } from "./getTbcSwapIx";

const accountInfoFromSim = (account: SimulatedTransactionAccountInfo) => {
  if (account.data[1] !== "base64") {
    throw new Error(
      `Expected account data to be base64 encoded, got ${account.data[1]}`
    );
  }
  const data = Buffer.from(account.data[0], "base64");

  return decodeTokenAccount(data);
};

const simulate = async (
  instructions: TransactionInstruction[],
  destinationAccount: PublicKey,
  connection: Connection
) => {
  const transaction = new Transaction();

  for (let i = 0; i < instructions.length; i++) {
    transaction.add(instructions[i]);
  }

  transaction.feePayer = SIMULATION_ACCOUNT_OWNER;

  const simResults = await connection.simulateTransaction(
    transaction,
    undefined,
    [destinationAccount]
  );

  if (simResults.value.err) {
    console.error(simResults);
    throw new Error("Simulation failed");
  }

  if (!simResults.value.accounts) {
    throw new Error("Expected simulation to have account data");
  }

  const account = simResults.value.accounts[0];
  if (!account) {
    throw new Error("Expected simulation to have exactly one account returned");
  }

  const { amount } = accountInfoFromSim(account);

  return amount;
};

export const simulateSrlyToTbcSwap = async (
  tbcOutputToken: TbcSuportedToken,
  inputAmount: u64,
  connection: Connection
) => {
  const transferIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    ORCA_POOL_SRLY_TOKEN_ACCOUNT,
    SIMULATION_SRLY_TOKEN_ACCOUNT,
    ORCA_POOL_OWNER,
    [],
    inputAmount
  );

  const tbcSwapIx = await getTbcSwapIx(
    inputAmount,
    new u64(0),
    tbcOutputToken,
    SIMULATION_ACCOUNT_OWNER,
    SIMULATION_SRLY_TOKEN_ACCOUNT,
    tbcOutputToken.simulationAccount,
    connection
  );

  return simulate(
    [transferIx, tbcSwapIx],
    tbcOutputToken.simulationAccount,
    connection
  );
};

export const simulateTbcToSrlySwap = async (
  tbcInputToken: TbcSuportedToken,
  inputAmount: u64,
  connection: Connection
) => {
  const transferIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    new PublicKey("GoV7a7iiJgQ4BUMFFsaodMdr9pCm3oFxUcjQ8VqawGug"),
    tbcInputToken.simulationAccount,
    new PublicKey("HWpdfSfuS3LDBVJCvLvAwNw6ffHYyTKnfUF86sZgUKXT"),
    [],
    inputAmount
  );

  const tbcSwapIx = await getTbcSwapIx(
    inputAmount,
    new u64(0),
    tbcInputToken,
    SIMULATION_ACCOUNT_OWNER,
    tbcInputToken.simulationAccount,
    SIMULATION_SRLY_TOKEN_ACCOUNT,
    connection
  );

  return simulate(
    [transferIx, tbcSwapIx],
    SIMULATION_SRLY_TOKEN_ACCOUNT,
    connection
  );
};
