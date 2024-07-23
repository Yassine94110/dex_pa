'use client';

import { Button } from './ui/button';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  useWriteContract,
  type BaseError,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { dexAbi } from '@/lib/abi/dex.abi';

interface RToDexProps {
  setIsRegistered: Dispatch<SetStateAction<boolean>>;
}

export const RegisterToDexButton = ({ setIsRegistered }: RToDexProps) => {
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const handleRegister = async () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      abi: dexAbi,
      functionName: 'register',
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsRegistered(true);
    }
  }, [isSuccess]);

  return (
    <div>
      <Button
        onClick={() => handleRegister()}
        disabled={isPending || isLoading}
      >
        {isPending
          ? 'Confirming...'
          : isLoading
          ? 'Transaction pending...'
          : 'Register to the DEX first'}
      </Button>
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};
