import { Keypair, Cluster, PublicKey } from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { utils as anchorUtils } from "@project-serum/anchor";
import bs58 from "bs58";

require("dotenv").config();

// Endpoints, connection
export const ENV: Cluster = "mainnet-beta";

// Sometimes, your RPC endpoint may reject you if you spam too many RPC calls. Sometimes, your PRC server
// may have invalid cache and cause problems.
export const SOLANA_RPC_ENDPOINT = "https://ssc-dao.genesysgo.net";

export const RLY_MINT_ADDRESS = new PublicKey(
  "sRLY3migNrkC1HLgqotpvi66qGkdNedqPZ9TJpAQhyh"
);

export const CSWAP_PROGRAM_ID = new PublicKey(
  "CSwAp3hdedZJBmhWMjv8BJ7anTLMQ2hBqKdnXV5bB3Nz"
);

export const TBC_PROGRAM_ID = new PublicKey(
  "TBCwReYDDw8SvwVVKJHgatzeXKrLHnaTPyDGwkUoBsq"
);

export const CSWAP_CANONICAL_MINT_AUTHORITY_PDA_SEED = Buffer.from(
  anchorUtils.bytes.utf8.encode("can_mint_authority")
);

export const CSWAP_WRAPPED_TOKEN_OWNER_AUTHORITY_PDA_SEED = Buffer.from(
  anchorUtils.bytes.utf8.encode("wrapped_acct_authority")
);

export const CSWAP_TOKEN_ACCOUNT_SEED = Buffer.from(
  anchorUtils.bytes.utf8.encode("token_account_seed")
);

const publicKeyLayout = (property: string = "publicKey"): any => {
  return BufferLayout.blob(32, property);
};

const uint64Layout = (property: string = "uint64"): any => {
  return BufferLayout.blob(8, property);
};

export const TokenSwapLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("bumpSeed"),
  publicKeyLayout("tokenProgramId"),
  publicKeyLayout("tokenAccountA"),
  publicKeyLayout("tokenAccountB"),
  publicKeyLayout("tokenPool"),
  publicKeyLayout("mintA"),
  publicKeyLayout("mintB"),
  publicKeyLayout("feeAccount"),
  uint64Layout("tradeFeeNumerator"),
  uint64Layout("tradeFeeDenominator"),
  uint64Layout("ownerTradeFeeNumerator"),
  uint64Layout("ownerTradeFeeDenominator"),
  uint64Layout("ownerWithdrawFeeNumerator"),
  uint64Layout("ownerWithdrawFeeDenominator"),
  uint64Layout("hostFeeNumerator"),
  uint64Layout("hostFeeDenominator"),
  BufferLayout.u8("curveType"),
  BufferLayout.blob(32, "curveParameters"),
]);

export const SIMULATION_ACCOUNT_OWNER = new PublicKey(
  "CRXvuJJRg4e7Fxj3TshGhbDcqMysSUbNDAoc8qJ2Jq1s"
);

export const SIMULATION_SRLY_TOKEN_ACCOUNT = new PublicKey(
  "Fr3oFRrjKZJeinpPbHLuUq7fyw79QqJokmb66weQvtmo"
);

export const ORCA_POOL_OWNER = new PublicKey(
  "BDmEnikYwue2wtzxZFhr29avpQdX3rrQrvSjYJimeteH"
);

export const ORCA_POOL_SRLY_TOKEN_ACCOUNT = new PublicKey(
  "7vY5bs27YTWus7KiemXsfaY4E2EzbrV5gXvbx1RaWJ8B"
);
