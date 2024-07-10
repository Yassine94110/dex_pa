export const dexAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], type: 'error', name: 'AccessControlBadConfirmation' },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
    ],
    type: 'error',
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
        indexed: true,
      },
      {
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
        indexed: true,
      },
      {
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
        indexed: true,
      },
    ],
    type: 'event',
    name: 'RoleAdminChanged',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
        indexed: true,
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
        indexed: true,
      },
    ],
    type: 'event',
    name: 'RoleGranted',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
        indexed: true,
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
        indexed: true,
      },
    ],
    type: 'event',
    name: 'RoleRevoked',
    anonymous: false,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
        indexed: true,
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
        indexed: false,
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
        indexed: false,
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
        indexed: false,
      },
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
        indexed: false,
      },
    ],
    type: 'event',
    name: 'SwapExecuted',
    anonymous: false,
  },
  { inputs: [], stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'ROLE_ADMIN',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'ROLE_BANNED',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'ROLE_USER',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  },
  {
    inputs: [
      { internalType: 'address', name: '_pool', type: 'address' },
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
    inputs: [{ internalType: 'address', name: '_bannedUser', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ban',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token1', type: 'address' },
      { internalType: 'address', name: '_token2', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'createLiquidityPool',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token1', type: 'address' },
      { internalType: 'address', name: '_token2', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'getPool',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'getPools',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'grantAdmin',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'grantRole',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'isUser',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
  {
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'register',
  },
  {
    inputs: [
      { internalType: 'address', name: '_pool', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'removeLiquidity',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'callerConfirmation',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'renounceRole',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'revokeRole',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    stateMutability: 'view',
    type: 'function',
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
  {
    inputs: [
      { internalType: 'address', name: '_pool', type: 'address' },
      { internalType: 'address', name: '_tokenIn', type: 'address' },
      { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
    name: 'swap',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
  },
  {
    inputs: [{ internalType: 'address', name: '_bannedUser', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'unban',
  },
  { inputs: [], stateMutability: 'payable', type: 'receive' },
] as const;