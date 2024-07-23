'use client';

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import ShinyButton from './ui/shiny-button';
import { activePoolAddressAtom, activeTokenAtom, swapAtom } from '@/lib/atom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { isRegistered } from '@/lib/dex.action';
import { dexAbi } from '@/lib/abi/dex.abi';
import { getSimpleAllowance, hasUserEnoughtBalance } from '@/lib/token.action';
import { getPoolInformation } from '@/lib/pool.action';
import { toast } from 'sonner';
import { erc20Abi } from 'viem';
import { BaseError } from '@wagmi/core';

export const CheckSwapLP = () => {
  const [poolAddress] = useAtom(activePoolAddressAtom);
  const [swap, setSwap] = useAtom(swapAtom);
  const [activeToken] = useAtom(activeTokenAtom);
  const [isRegister, setIsRegistered] = useState(false);
  const [enoughtBalance, setEnoughtBalance] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);

  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (account.status === 'connected') {
      isRegistered(account.address).then((registered) => {
        setIsRegistered(registered);
      });
    }
  }, [account.address, account, isSuccess]);

  useEffect(() => {
    if (!poolAddress) return;
    const pool = async () => await getPoolInformation(poolAddress);
    const setHasEnoughtBalance = async () => {
      const enoughtBal = await hasUserEnoughtBalance(
        account.address!,
        BigInt(swap.amount1) * BigInt(10 ** 18),
        BigInt(swap.amount2) * BigInt(10 ** 18),
        await pool()
      );
      setEnoughtBalance(enoughtBal);
    };
    setHasEnoughtBalance();
  }, [swap, activeToken, isSuccess]);

  useEffect(() => {
    if (!poolAddress) return;
    const allowance = async () => {
      const val = await getSimpleAllowance(
        poolAddress,
        account.address!,
        activeToken.token1?.address!
      );
      console.log('allowance', val, BigInt(swap.amount1) * BigInt(10 ** 18));
      if (val < BigInt(swap.amount1) * BigInt(10 ** 18)) {
        console.log('not enought allowance');
        setHasAllowance(false);
      } else {
        console.log('enought allowance');
        setHasAllowance(true);
      }
    };
    allowance();
  }, [swap, isSuccess]);

  const handleRegister = () => {
    console.log('register');
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'register',
    });
  };

  const handleAllowance = () => {
    writeContract({
      address: activeToken.token1?.address!,
      abi: erc20Abi,
      functionName: 'approve',
      args: [poolAddress!, BigInt(swap.amount1) * BigInt(10 ** 18)],
    });
  };

  const handleSwap = () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'swap',
      args: [
        poolAddress!,
        activeToken.token1?.address!,
        BigInt(swap.amount1) * BigInt(10 ** 18),
      ],
      value: BigInt(1000000000000000), // 1% of the swap amount
    });
    setSwap({
      amount1: 0,
      amount2: 0,
    });
  };

  return (
    <div>
      <button
        onClick={() =>
          !isRegister
            ? handleRegister()
            : !hasAllowance
            ? handleAllowance()
            : handleSwap()
        }
        className='cursor-pointer'
        disabled={
          account.status !== 'connected' ||
          !poolAddress ||
          isLoading ||
          isPending ||
          !enoughtBalance
        }
      >
        <ShinyButton
          text={
            account.status !== 'connected'
              ? 'Connect Your Wallet First'
              : !poolAddress
              ? 'This pool not exist'
              : !enoughtBalance
              ? 'Not Enought Balance'
              : !isRegister
              ? 'Register first'
              : !hasAllowance
              ? 'Approve'
              : isLoading || isPending
              ? 'Loading...'
              : 'Swap'
          }
        />
      </button>
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};
