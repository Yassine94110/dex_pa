import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Button } from './ui/button';
import { dexAbi } from '@/lib/abi/dex.abi';
import { BaseError } from '@wagmi/core';
import { Pool } from '@/lib/pool.action';
import { useEffect } from 'react';
import { getAllowance } from '@/lib/token.action';
import { ButtonApproveToken } from './ButtonApproveToken';
import { useAtom } from 'jotai';
import { allowanceAtom, tokenAtom } from '@/lib/atom';
import { refetchPoolData } from '@/lib/dex.action';

interface BTALProps {
  pool: Pool;
}

export const ButtonAddLiquidity = ({ pool }: BTALProps) => {
  const [token] = useAtom(tokenAtom);
  const [allowanceToken, setAllowanceToken] = useAtom(allowanceAtom);

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
      pool.address,
      account.address,
      pool.assetOne.address,
      pool.assetTwo.address
    ).then((allowance) => {
      console.log('allowance', allowance);
      setAllowanceToken(allowance);
    });
  }, [token.value, account.address]);

  useEffect(() => {
    refetchPoolData(pool.address);
  }, [isSuccess]);

  return (
    <div>
      {allowanceToken.token1 >= BigInt(token.value) &&
        allowanceToken.token2 >= BigInt(token.value) && (
          <Button
            onClick={() => handleAddLiquidity()}
            disabled={isPending || isLoading || !token.value}
          >
            {isPending
              ? 'Confirming...'
              : isLoading
              ? 'Transaction pending...'
              : !token.value
              ? 'Set value to add first'
              : 'Add Liquidity'}
          </Button>
        )}
      {allowanceToken.token1 < BigInt(token.value) && (
        <ButtonApproveToken
          assetOne={pool.assetTwo}
          assetTwo={pool.assetOne}
          poolAddress={pool.address}
        />
      )}
      {allowanceToken.token2 < BigInt(token.oppositeAmount) && (
        <ButtonApproveToken
          assetOne={pool.assetOne}
          assetTwo={pool.assetTwo}
          poolAddress={pool.address}
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
