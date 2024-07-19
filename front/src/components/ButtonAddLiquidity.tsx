import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Button } from './ui/button';
import { dexAbi } from '@/lib/abi/dex.abi';
import { BaseError } from '@wagmi/core';
import { Pool } from '@/lib/pool.action';
import { useEffect, useState } from 'react';
import { getAllowance } from '@/lib/token.action';
import { ButtonApproveToken } from './ButtonApproveToken';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/lib/atom';

interface BTALProps {
  pool: Pool;
}

export const ButtonAddLiquidity = ({ pool }: BTALProps) => {
  const [token] = useAtom(tokenAtom);
  const [allowanceToken, setAllowanceToken] = useState({
    token1: BigInt(0),
    token2: BigInt(0),
  });

  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleAddLiquidity = async () => {
    console.log('token.value', BigInt(token.value));
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'addLiquidity',
      args: [
        pool.assetOne.address,
        pool.assetTwo.address,
        BigInt(token.value) * BigInt(10 ** 18),
      ],
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!account.address) return;
    getAllowance(
      account.address,
      pool.assetOne.address,
      pool.assetTwo.address
    ).then((allowance) => {
      console.log('allowance', allowance);
      setAllowanceToken(allowance);
    });
  }, [token.value, account.address]);

  return (
    <div>
      {allowanceToken.token1 >= BigInt(token.value) &&
        allowanceToken.token2 >= BigInt(token.value) && (
          <Button
            onClick={() => handleAddLiquidity()}
            disabled={isPending || isLoading}
          >
            {isPending
              ? 'Confirming...'
              : isLoading
              ? 'Transaction pending...'
              : 'Add Liquidity'}
          </Button>
        )}
      {allowanceToken.token1 < BigInt(token.value) && (
        <ButtonApproveToken
          tokenAddress={pool.assetTwo.address}
          symbol={pool.assetTwo.symbol}
        />
      )}
      {allowanceToken.token2 < BigInt(token.oppositeAmount) && (
        <ButtonApproveToken
          tokenAddress={pool.assetOne.address}
          symbol={pool.assetOne.symbol}
        />
      )}
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};
