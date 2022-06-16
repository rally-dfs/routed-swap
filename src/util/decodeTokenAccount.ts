import { AccountLayout, u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const decodeTokenAccount = (data: Buffer) => {
  const decodedAccountInfo = AccountLayout.decode(data);
  const accountInfo: { mint: PublicKey; owner: PublicKey; amount: u64 } = {
    mint: new PublicKey(decodedAccountInfo.mint),
    owner: new PublicKey(decodedAccountInfo.owner),
    amount: u64.fromBuffer(decodedAccountInfo.amount),
  };
  return accountInfo;
};
