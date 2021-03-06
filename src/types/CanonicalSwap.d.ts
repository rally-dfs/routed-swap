export type CanonicalSwap = {
  version: "0.1.0";
  name: "canonical_swap";
  instructions: [
    {
      name: "initializeCanonicalToken";
      accounts: [
        {
          name: "initializer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "canonicalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pdaCanonicalMintAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "canonicalData";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "canonicalMintAuthorityBump";
          type: "u8";
        }
      ];
    },
    {
      name: "initializeWrappedToken";
      accounts: [
        {
          name: "currentAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "wrappedTokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "pdaWrappedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pdaWrappedTokenAccountAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "canonicalData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "wrappedData";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "wrappedTokenAccountBump";
          type: "u8";
        },
        {
          name: "wrappedTokenAccountAuthorityBump";
          type: "u8";
        }
      ];
    },
    {
      name: "swapWrappedForCanonical";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "destinationCanonicalTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "canonicalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pdaCanonicalMintAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "sourceWrappedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "wrappedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "canonicalData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "wrappedData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "canonicalAmount";
          type: "u64";
        },
        {
          name: "canonicalMintAuthorityBump";
          type: "u8";
        }
      ];
    },
    {
      name: "swapCanonicalForWrapped";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "sourceCanonicalTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "canonicalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destinationWrappedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "wrappedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pdaWrappedTokenAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "canonicalData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "wrappedData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "wrappedAmount";
          type: "u64";
        },
        {
          name: "wrappedTokenAccountAuthorityBump";
          type: "u8";
        }
      ];
    },
    {
      name: "pauseWrappedToken";
      accounts: [
        {
          name: "currentAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "canonicalData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "wrappedData";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "unpauseWrappedToken";
      accounts: [
        {
          name: "currentAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "canonicalData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "wrappedData";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "setCanonicalSwapAuthority";
      accounts: [
        {
          name: "currentAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "newAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "canonicalData";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "CanonicalData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "decimals";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "WrappedData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "canonicalData";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "decimals";
            type: "u8";
          },
          {
            name: "paused";
            type: "bool";
          }
        ];
      };
    }
  ];
};
