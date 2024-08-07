export const liquityPoolsAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_assetOneAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_assetTwoAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], type: 'error', name: 'ReentrancyGuardReentrantCall' },
  { inputs: [], type: 'error', name: 'Unauthorized' },
  { inputs: [], type: 'error', name: 'addressNotCorrect' },
  { inputs: [], type: 'error', name: 'amountTooBig' },
  { inputs: [], type: 'error', name: 'assetNotCorrect' },
  {
    inputs: [],
    type: 'error',
    name: 'initialLiquidityAlreadyProvided',
  },
  { inputs: [], type: 'error', name: 'notEnoughGas' },
  { inputs: [], type: 'error', name: 'notEnoughTimePassed' },
  { inputs: [], type: 'error', name: 'notEnoughTokens' },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'uint256',
        name: '_assetOneAmount',
        type: 'uint256',
        indexed: false,
      },
      {
        internalType: 'uint256',
        name: '_assetTwoAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    type: 'event',
    name: 'liquidityAdded',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'uint256',
        name: '_assetOneAmount',
        type: 'uint256',
        indexed: false,
      },
      {
        internalType: 'uint256',
        name: '_assetTwoAmount',
        type: 'uint256',
        indexed: false,
      },
    ],
    type: 'event',
    name: 'liquidityRemoved',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
        indexed: false,
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
        indexed: false,
      },
    ],
    type: 'event',
    name: 'priceChanged',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
        indexed: false,
      },
    ],
    type: 'event',
    name: 'yieldFarmed',
    anonymous: false,
  },
  { inputs: [], stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_assetOneAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_assetTwoAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'addInitialLiquidity',
  },
  {
    inputs: [
      { internalType: 'address', name: '_asset', type: 'address' },
      {
        internalType: 'address',
        name: '_secondAsset',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'addLiquidity',
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'addressBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'amountOfOppositeTokenNeeded',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'assetOneAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'assetOnePrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'assetTwoAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'assetTwoPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newSwapFee', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'changeSwapFee',
  },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'getAssetBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'getAssetOne',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'getAssetTwo',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'getLpTokenQuantity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sellingAsset',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'getSwapQuantity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'getYield',
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'initialLiquidity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'initialLiquidityProvidedTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'isTime',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'isTimeInitialLiquidity',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'lastYieldFarmedTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'liquidity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'lpTokenQuantity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'removeLiquidity',
  },
  {
    inputs: [
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
    name: 'sellAsset',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'swapFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'yield',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    name: 'yieldTaken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  },
  { inputs: [], stateMutability: 'payable', type: 'receive' },
];
