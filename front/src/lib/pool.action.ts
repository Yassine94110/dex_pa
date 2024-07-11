'use server';

import { readContract } from '@wagmi/core';
import { dexAbi } from './abi/dex.abi';
import { config } from './back.config';
import { liquityPoolsAbi } from './abi/liquidityPools.abi';
import { erc20Abi } from 'viem';

export interface Pool {
  address: `0x${string}`;
  tvl: number;
  assetOneLock: bigint;
  assetTwoLock: bigint;
  assetOne: Asset;
  assetTwo: Asset;
}

export interface Asset {
  address: `0x${string}`;
  name: string;
  symbol: string;
}

export const getAllPools = async () => {
  const poolsAddress = (await readContract(config, {
    abi: dexAbi,
    address: process.env.DEX_CONTRACT! as `0x${string}`,
    functionName: 'getPools',
  })) as `0x${string}`[];

  let pools: Pool[] = [];
  for (let poolAddress of poolsAddress) {
    const poolInformation = await getPoolInformation(poolAddress);
    pools.push(poolInformation);
  }

  return pools;
};

export const getPoolInformation = async (poolAddress: `0x${string}`) => {
  const assetOneAddress = (await readContract(config, {
    address: poolAddress,
    abi: liquityPoolsAbi,
    functionName: 'assetOneAddress',
  })) as `0x${string}`;

  const assetTwoAddress = (await readContract(config, {
    address: poolAddress,
    abi: liquityPoolsAbi,
    functionName: 'assetTwoAddress',
  })) as `0x${string}`;

  const assetInformationOne = await getAssetInformation(assetOneAddress);
  const assetInformationTwo = await getAssetInformation(assetTwoAddress);

  const poolInformation: Pool = {
    address: poolAddress,
    tvl: 0,
    assetOneLock: await getAssetLock(assetOneAddress, poolAddress),
    assetTwoLock: await getAssetLock(assetTwoAddress, poolAddress),
    assetOne: {
      address: assetOneAddress,
      name: assetInformationOne.name,
      symbol: assetInformationOne.symbol,
    },
    assetTwo: {
      address: assetTwoAddress,
      name: assetInformationTwo.name,
      symbol: assetInformationTwo.symbol,
    },
  };

  return poolInformation;
};

export const getAssetLock = async (
  assetAddress: `0x${string}`,
  poolAddress: `0x${string}`
) => {
  const assetInformation = await readContract(config, {
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [poolAddress],
  });

  return assetInformation;
};

export const getAssetInformation = async (assetAddress: `0x${string}`) => {
  const symbol = await readContract(config, {
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  const name = await readContract(config, {
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'name',
  });

  return { name, symbol };
};
