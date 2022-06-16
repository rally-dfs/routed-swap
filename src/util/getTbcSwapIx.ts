import { AnchorProvider, BN, Program, Wallet } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { TBC_PROGRAM_ID } from "../constants";
import { TbcSuportedToken } from "../constants/tbcSupportedTokens";
import { TokenBondingCurveSwap } from "../types/TokenBondingCurveSwap";
import idl from "../idls/tbc.json";
import { decodeTokenAccount } from "./decodeTokenAccount";

export const getTbcSwapIx = async (
  amountIn: BN,
  minAmountOut: BN,
  supportedToken: TbcSuportedToken,
  userPubkey: PublicKey,
  userSourceTokenAccount: PublicKey,
  userDestinationTokenAccount: PublicKey,
  connection: Connection
) => {
  const wallet = new Wallet(Keypair.generate()); // since we are only getting the ix out we can use a fake wallet
  const tbcSwap = new Program(
    idl as any,
    TBC_PROGRAM_ID,
    new AnchorProvider(connection, wallet, {})
  ) as Program<TokenBondingCurveSwap>;

  const [swapAuthorityPDA] = await PublicKey.findProgramAddress(
    [supportedToken.swapInfoPubkey.toBuffer()],
    TBC_PROGRAM_ID
  );

  const resp = await connection.getAccountInfo(userSourceTokenAccount);
  if (resp === null) {
    throw new Error("Could not get account data for user source token account");
  }

  const swapSourceInfo = decodeTokenAccount(resp.data);

  const aToB = swapSourceInfo.mint.equals(supportedToken.swapInfo.mintA);

  const swapSourceTokenAccount = aToB
    ? supportedToken.swapInfo.tokenAccountA
    : supportedToken.swapInfo.tokenAccountB;
  const swapDestinationTokenAccount = aToB
    ? supportedToken.swapInfo.tokenAccountB
    : supportedToken.swapInfo.tokenAccountA;

  return await tbcSwap.methods
    .swap(amountIn, minAmountOut)
    .accounts({
      tokenSwap: supportedToken.swapInfoPubkey,
      swapAuthority: swapAuthorityPDA,
      userTransferAuthority: userPubkey,
      source: userSourceTokenAccount,
      destination: userDestinationTokenAccount,
      swapSource: swapSourceTokenAccount,
      swapDestination: swapDestinationTokenAccount,
      poolMint: supportedToken.swapInfo.poolToken,
      poolFee: supportedToken.swapInfo.feeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
};
