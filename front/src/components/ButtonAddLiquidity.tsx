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
import { getAllowance, getBalanceOf } from '@/lib/token.action';
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

    getBalanceOf(pool.assetOne.address, account.address).then((balance) => {
      if (!balance) return;
      console.log('balance token1', balance / BigInt(10 ** 18));
      const tokenValue = BigInt(token.value) * BigInt(10 ** 18);
      console.log('token1 value setted', token.value);
      if (tokenValue < balance) {
        getBalanceOf(pool.assetTwo.address, account.address!).then(
          (balance) => {
            if (!balance) return;
            console.log('balance token2', balance / BigInt(10 ** 18));
            console.log('token2 value setted', token.oppositeAmount);
            const tokenValue = BigInt(token.oppositeAmount) * BigInt(10 ** 18);
            if (tokenValue < balance) {
              setEnoughtBalance(true);
            }
          }
        );
      } else {
        setEnoughtBalance(false);
      }
    });

    getAllowance(
      pool.address,
      account.address,
      pool.assetOne.address,
      pool.assetTwo.address
    ).then((allowance) => {
      setAllowanceToken(allowance);
    });
  }, [token.value, account.address]);

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
        allowanceToken.token1 >= BigInt(token.value) &&
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
      <div className='flex gap-4'>
        {enoughtBalance && allowanceToken.token1 < BigInt(token.value) && (
          <ButtonApproveToken
            assetOne={pool.assetTwo}
            assetTwo={pool.assetOne}
            poolAddress={pool.address}
          />
        )}
        {enoughtBalance &&
          allowanceToken.token2 < BigInt(token.oppositeAmount) && (
            <ButtonApproveToken
              assetOne={pool.assetOne}
              assetTwo={pool.assetTwo}
              poolAddress={pool.address}
            />
          )}
        {!enoughtBalance && !token.value && (
          <Button disabled>Set Value To Add First</Button>
        )}
        {!enoughtBalance && token.value && (
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
