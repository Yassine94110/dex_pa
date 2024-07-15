'use server';

import { readContract, simulateContract, writeContract } from '@wagmi/core';
import { dexAbi } from './abi/dex.abi';
import { config } from './config';

export const addLiquidity = async (
  tokenAddress1: `0x${string}`,
  tokenAddress2: `0x${string}`,
  amount: bigint
) => {
  const { request } = await simulateContract(config, {
    abi: dexAbi,
    address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
    functionName: 'addLiquidity',
    args: [tokenAddress1, tokenAddress2, amount],
  });
  const hash = await writeContract(config, request);
  console.log('Transaction success', hash);
};

export const isRegistered = async (userAddress: `0x${string}`) => {
  const isRegistered = (await readContract(config, {
    address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
    abi: dexAbi,
    functionName: 'isUser',
    account: userAddress,
  })) as boolean;
  return isRegistered;
};
