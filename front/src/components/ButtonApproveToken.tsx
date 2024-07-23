'use client';

import { Button } from './ui/button';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { erc20Abi } from 'viem';
import { BaseError } from '@wagmi/core';
import { useAtom } from 'jotai';
import { allowanceAtom, tokenAtom } from '@/lib/atom';
import { useEffect } from 'react';
import { getAllowance } from '@/lib/token.action';
import { Asset } from '@/lib/pool.action';

interface BATProps {
  assetOne: Asset;
  assetTwo: Asset;
  poolAddress: `0x${string}`;
  tokenId: 1 | 2;
}

export const ButtonApproveToken = ({
  assetOne,
  assetTwo,
  poolAddress,
  tokenId,
}: BATProps) => {
  const [token] = useAtom(tokenAtom);
  const [allowanceToken, setAllowanceToken] = useAtom(allowanceAtom);
  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleApproveToken = async () => {
    const tokenValue = tokenId === 1 ? token.value1 : token.value2;
    writeContract({
      address: tokenId === 1 ? assetOne.address : assetTwo.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [poolAddress, tokenValue],
    });
  };
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!token.value1) return;
    if (!account.address) return;
    getAllowance(
      poolAddress,
      account.address,
      assetOne.address,
      assetTwo.address
    ).then((allowance) => {
      console.log('allowance', allowance);
      setAllowanceToken(allowance);
    });
  }, [isSuccess]);

  return (
    <>
      <Button
        onClick={() => handleApproveToken()}
        disabled={isPending || isLoading}
      >
        {isPending
          ? 'Confirming...'
          : isLoading
          ? 'Transaction pending...'
          : `Approve ${
              tokenId === 1 ? assetOne.symbol : assetTwo.symbol
            } token`}
      </Button>
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </>
  );
};
