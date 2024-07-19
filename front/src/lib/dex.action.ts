'use server';

import { readContract } from '@wagmi/core';

import { dexAbi } from './abi/dex.abi';
import { config } from './config';
import { revalidatePath } from 'next/cache';

export const isRegistered = async (userAddress: `0x${string}`) => {
  const isRegistered = (await readContract(config, {
    address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
    abi: dexAbi,
    functionName: 'isUser',
    account: userAddress,
  })) as boolean;
  return isRegistered;
};

export const refetchPoolData = async (id: string) => {
  revalidatePath(`/pool/${id}`);
};
