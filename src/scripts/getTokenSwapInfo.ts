import { Connection, PublicKey } from "@solana/web3.js";
import { TBC_SUPPORTED_TOKENS } from "src/constants/tbcSupportedTokens";
import {
  SOLANA_RPC_ENDPOINT,
  TBC_PROGRAM_ID,
  TokenSwapLayout,
} from "../constants";

const loadAccount = async (
  connection: Connection,
  address: PublicKey,
  programId: PublicKey
) => {
  const accountInfo = await connection.getAccountInfo(address);
  if (accountInfo === null) {
    throw new Error("Failed to find account");
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`);
  }
  return Buffer.from(accountInfo.data);
};

const getTokenSwapInfo = async (
  connection: Connection,
  swapInfoPubKey: PublicKey,
  programId: PublicKey
) => {
  const data = await loadAccount(connection, swapInfoPubKey, programId);

  const tokenSwapData = TokenSwapLayout.decode(data);
  // @ts-ignore
  if (!tokenSwapData.isInitialized) {
    throw new Error(`Invalid token swap state`);
  }

  // @ts-ignore
  if (!tokenSwapData.isInitialized) {
    throw new Error(`Invalid token swap state`);
  }

  const [authority] = await PublicKey.findProgramAddress(
    [swapInfoPubKey.toBuffer()],
    programId
  );

  // @ts-ignore
  const poolToken = new PublicKey(tokenSwapData.tokenPool);

  // @ts-ignore
  const feeAccount = new PublicKey(tokenSwapData.feeAccount);

  // @ts-ignore
  const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA);

  // @ts-ignore
  const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB);

  // @ts-ignore
  const mintA = new PublicKey(tokenSwapData.mintA);

  // @ts-ignore
  const mintB = new PublicKey(tokenSwapData.mintB);

  // @ts-ignore
  const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId);

  // @ts-ignore
  const curveType = tokenSwapData.curveType;

  return {
    programId,
    tokenProgramId,
    poolToken,
    feeAccount,
    authority,
    tokenAccountA,
    tokenAccountB,
    mintA,
    mintB,
    curveType,
  };
};

const main = async () => {
  const connection = new Connection(SOLANA_RPC_ENDPOINT); // Setup Solana RPC connection
  const swapInfo = await getTokenSwapInfo(
    connection,
    TBC_SUPPORTED_TOKENS[1].swapInfoPubkey,
    TBC_PROGRAM_ID
  );

  console.log(`programId: new PublicKey("${swapInfo.programId.toBase58()}")`);
  console.log(
    `tokenProgramId: new PublicKey("${swapInfo.tokenProgramId.toBase58()}")`
  );
  console.log(`poolToken: new PublicKey("${swapInfo.poolToken.toBase58()}")`);
  console.log(`feeAccount: new PublicKey("${swapInfo.feeAccount.toBase58()}")`);
  console.log(`authority: new PublicKey("${swapInfo.authority.toBase58()}")`);
  console.log(
    `tokenAccountA: new PublicKey("${swapInfo.tokenAccountA.toBase58()}")`
  );
  console.log(
    `tokenAccountB: new PublicKey("${swapInfo.tokenAccountB.toBase58()}")`
  );
  console.log(`mintA: new PublicKey("${swapInfo.mintA.toBase58()}")`);
  console.log(`mintB: new PublicKey("${swapInfo.mintB.toBase58()}")`);
};

main();
