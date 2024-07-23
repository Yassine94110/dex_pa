'use client';

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Button } from './ui/button';
import { dexAbi } from '@/lib/abi/dex.abi';
import { BaseError } from '@wagmi/core';
import { getPoolInformation, Pool } from '@/lib/pool.action';
import { useEffect, useState } from 'react';
import { getAllowance, hasUserEnoughtBalance } from '@/lib/token.action';
import { ButtonApproveToken } from './ButtonApproveToken';
import { useAtom } from 'jotai';
import { allowanceAtom, tokenAtom } from '@/lib/atom';

interface BTALProps {
  pool: Pool;
}

export const ButtonAddLiquidity = ({ pool }: BTALProps) => {
  const [token] = useAtom(tokenAtom);
  const [allowanceToken, setAllowanceToken] = useAtom(allowanceAtom);
  const [enoughtBalance, setEnoughtBalance] = useState(false);

  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleAddLiquidity = async () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'addLiquidity',
      args: [pool.assetOne.address, pool.assetTwo.address, token.value1],
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!account.address) return;

    hasUserEnoughtBalance(
      account.address,
      token.value1,
      token.value2,
      pool
    ).then((enought) => setEnoughtBalance(enought));

    getAllowance(
      pool.address,
      account.address,
      pool.assetOne.address,
      pool.assetTwo.address
    ).then((allowance) => {
      setAllowanceToken(allowance);
    });
  }, [token, account.address]);

  useEffect(() => {
    if (!isSuccess) return;
    getPoolInformation(pool.address).then((pool) => {
      console.log('pool', pool);
      window.location.reload();
    });
  }, [isSuccess]);

  return (
    <div>
      {enoughtBalance &&
        allowanceToken.token1 >= token.value1 &&
        allowanceToken.token2 >= token.value2 && (
          <Button
            onClick={() => handleAddLiquidity()}
            disabled={isPending || isLoading || !token.value1}
          >
            {isPending
              ? 'Confirming...'
              : isLoading
              ? 'Transaction pending...'
              : !token.value1
              ? 'Set value to add first'
              : 'Add Liquidity'}
          </Button>
        )}
      <div className='flex gap-4'>
        {enoughtBalance && allowanceToken.token1 < token.value1 && (
          <ButtonApproveToken
            assetOne={pool.assetOne}
            assetTwo={pool.assetTwo}
            poolAddress={pool.address}
            tokenId={1}
          />
        )}
        {enoughtBalance && allowanceToken.token2 < token.value2 && (
          <ButtonApproveToken
            assetOne={pool.assetOne}
            assetTwo={pool.assetTwo}
            poolAddress={pool.address}
            tokenId={2}
          />
        )}
        {!enoughtBalance && !token.value1 && (
          <Button disabled>Set Value To Add First</Button>
        )}
        {!enoughtBalance && token.value1 && (
          <Button disabled>Not Enought Balance</Button>
        )}
      </div>
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};
