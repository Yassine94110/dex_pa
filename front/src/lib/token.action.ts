'use server';

import { erc20Abi } from 'viem';
import { config } from './config';
import { readContract } from '@wagmi/core';
import { revalidatePath } from 'next/cache';
import { Pool } from './pool.action';

export interface Token {
  id: number;
  address: `0x${string}`;
  name: string;
  ticker: string;
  supply: number;
  date: string;
}

export const getAllTokens = async () => {
  const tokens = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`);
  revalidatePath('/token');
  revalidatePath('/swap');
  return tokens.json();
};

export const getAllowance = async (
  poolAddress: `0x${string}`,
  userAddress: `0x${string}`,
  tokenAddress1: `0x${string}`,
  tokenAddress2: `0x${string}`
) => {
  const allowance1 = (await readContract(config, {
    address: tokenAddress1,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [userAddress, poolAddress],
  })) as bigint;

  const allowance2 = (await readContract(config, {
    address: tokenAddress2,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [userAddress, poolAddress],
  })) as bigint;

  return { token1: allowance1, token2: allowance2 };
};

export const getBalanceOf = async (
  address: `0x${string}`,
  userAddress: `0x${string}`
): Promise<bigint | null> => {
  const balance = await readContract(config, {
    address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress],
  });

  if (typeof balance === 'bigint') {
    return balance;
  } else return null;
};

export const hasUserEnoughtBalance = async (
  userAddress: `0x${string}`,
  value1: bigint,
  value2: bigint,
  pool: Pool
): Promise<boolean> => {
  const balance = await getBalanceOf(pool.assetOne.address, userAddress);
  if (!balance) return false;
  if (value1 * BigInt(10 ** 18) < balance) {
    const balance2 = await getBalanceOf(pool.assetTwo.address, userAddress);
    if (!balance2) return false;
    if (BigInt(value2) * BigInt(10 ** 18) < balance2) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};
