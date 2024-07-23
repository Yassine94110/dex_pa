'use server';

import { readContract } from '@wagmi/core';

import { dexAbi } from './abi/dex.abi';
import { config } from './config';

export const isRegistered = async (userAddress: `0x${string}`) => {
  const isRegistered = (await readContract(config, {
    address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
    abi: dexAbi,
    functionName: 'isUser',
    account: userAddress,
  })) as boolean;
  return isRegistered;
};

export const isAdmin = async (userAddress: `0x${string}`) => {
  try {
    const isAdmin = (await readContract(config, {
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'isAdmin',
      account: userAddress,
    })) as boolean;
    return isAdmin;
  } catch (error) {
    return false;
  }
};
