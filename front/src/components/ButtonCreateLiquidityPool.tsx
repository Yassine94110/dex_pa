'use client';

import { useAtom } from 'jotai';
import { Button } from './ui/button';
import { activeTokenAtom, allowanceAtom, tokenAtom } from '@/lib/atom';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { dexAbi } from '@/lib/abi/dex.abi';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getPool, getPoolInformation, Pool } from '@/lib/pool.action';
import { ButtonApproveToken } from './ButtonApproveToken';

export const ButtonCreateLiquidityPool = () => {
  const [amount, setAmount] = useAtom(tokenAtom);
  const [activeToken] = useAtom(activeTokenAtom);
  const [allowanceToken, setAllowanceToken] = useAtom(allowanceAtom);
  const [hasBeenCreated, setHasBeenCreated] = useState(false);
  const [pool, setPool] = useState<Pool | null>(null);

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleCreate = async () => {
    if (
      activeToken.token1?.address === undefined ||
      activeToken.token2?.address === undefined
    )
      return;
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT as `0x${string}`,
      abi: dexAbi,
      functionName: 'createLiquidityPool',
      args: [activeToken.token1?.address, activeToken.token2?.address],
    });
  };

  const handleAddLiquidity = async () => {
    if (pool === null) return;
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT as `0x${string}`,
      abi: dexAbi,
      functionName: 'addInitialLiquidity',
      args: [pool?.address, amount.value1, amount.value2],
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && !hasBeenCreated) {
      toast.success('Liquidity pool created successfully');
      setHasBeenCreated(true);
      const token1 = activeToken.token1?.address;
      const token2 = activeToken.token2?.address;
      getPool(token1!, token2!).then((pool) => {
        getPoolInformation(pool).then((poolInfo) => {
          setPool(poolInfo);
        });
      });
    } else if (isSuccess && hasBeenCreated) {
      toast.success('Liquidity added successfully');
    }
  }, [isSuccess]);

  return (
    <div>
      {!hasBeenCreated ? (
        <Button
          className='ml-auto'
          disabled={
            amount.value1 === BigInt(0) ||
            amount.value2 === BigInt(0) ||
            isPending ||
            isLoading
          }
          onClick={handleCreate}
        >
          {amount.value1 === BigInt(0) || amount.value2 === BigInt(0)
            ? 'Enter tokens amount'
            : isPending || isLoading
            ? 'Loading...'
            : 'Create Liquidity Pool'}
        </Button>
      ) : (
        <div>
          <div className='flex gap-4'>
            {pool && allowanceToken.token1 < amount.value1 && (
              <ButtonApproveToken
                assetOne={pool.assetOne}
                assetTwo={pool.assetTwo}
                poolAddress={pool.address}
                tokenId={1}
              />
            )}
            {pool && allowanceToken.token2 < amount.value2 && (
              <ButtonApproveToken
                assetOne={pool.assetOne}
                assetTwo={pool.assetTwo}
                poolAddress={pool.address}
                tokenId={2}
              />
            )}
          </div>
          {allowanceToken.token1 >= amount.value1 &&
            allowanceToken.token2 >= amount.value2 && (
              <Button
                className='ml-auto'
                disabled={isLoading || isPending}
                onClick={handleAddLiquidity}
              >
                {isLoading || isPending
                  ? 'Loading...'
                  : 'Add Initial Liquidity'}
              </Button>
            )}
        </div>
      )}
    </div>
  );
};
