import { PublicKey } from "@solana/web3.js";

export type SwapInfo = {
  programId: PublicKey;
  tokenProgramId: PublicKey;
  poolToken: PublicKey;
  feeAccount: PublicKey;
  authority: PublicKey;
  tokenAccountA: PublicKey;
  tokenAccountB: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
};

export type TbcSuportedToken = {
  name: string;
  symbol: string;
  decimals: number;
  swapInfoPubkey: PublicKey;
  mintPubkey: PublicKey;
  simulationAccount: PublicKey;
  swapInfo: SwapInfo;
};

export const TBC_SUPPORTED_TOKENS: TbcSuportedToken[] = [
  {
    name: "GARY",
    symbol: "$GARY",
    decimals: 9,
    swapInfoPubkey: new PublicKey(
      "CdXrKbvTD6L1FNqMHxuXWXYgkanLLrgKKuCY9uRDe8wx"
    ),
    mintPubkey: new PublicKey("8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk"),
    simulationAccount: new PublicKey(
      "CwJ11TQLZwwRmb5qmGDP3aH7PWyEuimZo1zRxCgvqifG"
    ),
    swapInfo: {
      programId: new PublicKey("TBCwReYDDw8SvwVVKJHgatzeXKrLHnaTPyDGwkUoBsq"),
      tokenProgramId: new PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      ),
      poolToken: new PublicKey("2b1TAMLbbYYqadRP3kbPyuCLHAhvo57Qw7hJMReEUH3e"),
      feeAccount: new PublicKey("A14mob777MWB7EJFb2V775xP1Wf3g5Z65E6QEZPNa5G1"),
      authority: new PublicKey("ErVPn1cSE1WqprpWRGf9WRMyP4T7q5HWAHYzEAGnb43o"),
      tokenAccountA: new PublicKey(
        "7wFUHUwWsSi6r2YrFFCz3ZsDHDZPpvC6YsqyvqeAhMtb"
      ),
      tokenAccountB: new PublicKey(
        "9BsBgtxZDYXByYfftAtVEhFKXwtatQ4UEQdZpTQEMbxb"
      ),
      mintA: new PublicKey("sRLY3migNrkC1HLgqotpvi66qGkdNedqPZ9TJpAQhyh"),
      mintB: new PublicKey("8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk"),
    },
  },
];
