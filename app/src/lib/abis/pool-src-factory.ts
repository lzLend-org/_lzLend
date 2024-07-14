export const poolSrcFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "srcPoolAddress",
        type: "address",
      },
    ],
    name: "DeployedSrcPool",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "srcPoolAddress",
        type: "address",
      },
    ],
    name: "buySrcPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_endpoint",
        type: "address",
      },
      {
        internalType: "address",
        name: "_delegate",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_dstChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "_dstPoolAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_poolToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracleAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_oraclePricesIndex",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_collateralToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ltv",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_apr",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_expiry",
        type: "uint256",
      },
    ],
    name: "deploySrcPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSrcPools",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getListedSrcPools",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getSrcPoolsByOwner",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "srcPoolAddress",
        type: "address",
      },
    ],
    name: "listSrcPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
