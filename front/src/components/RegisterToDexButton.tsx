'use client';

import { dexAbi } from '@/lib/abi/dex.abi';
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from 'wagmi';
import { Button } from './ui/button';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface RegisterToDexButtonProps {
  setIsRegistered: Dispatch<SetStateAction<boolean>>;
}

export const RegisterToDexButton = ({
  setIsRegistered,
}: RegisterToDexButtonProps) => {
  const {
    data: hash,
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleRegister = async () => {
    writeContract({
      abi: dexAbi,
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      functionName: 'register',
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsRegistered(true);
    }
  }, [isSuccess]);

  return (
    <div>
      {!isPending ? (
        <Button onClick={() => handleRegister()}>
          Register to the DEX first
        </Button>
      ) : (
        <Button disabled variant='ghost'>
          Loading
        </Button>
      )}
      {error && (
        <div className='text-xs italic text-red-900 mt-4'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
};
