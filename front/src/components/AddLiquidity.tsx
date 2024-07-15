'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { getOppositeAmount, Pool } from '@/lib/pool.action';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  usePrepareTransactionRequest,
  type BaseError,
} from 'wagmi';
import { dexAbi } from '@/lib/abi/dex.abi';
import { RegisterToDexButton } from './RegisterToDexButton';
import { isRegistered } from '@/lib/dex.action';

export const AddLiquidity = ({ pool }: { pool: Pool }) => {
  const { assetOneLock, assetTwoLock, assetOne, assetTwo } = pool;
  const [token1, setToken1] = useState<string>('');
  const [token2, setToken2] = useState<string>('');
  const [isRegister, setIsRegistered] = useState(false);

  const account = useAccount();

  useEffect(() => {
    if (account.status === 'connected') {
      isRegistered(account.address).then((registered) => {
        setIsRegistered(registered);
        console.log('registered', registered);
      });
    }
  }, [account]);

  const {
    data: hash,
    writeContract,
    isPending,
    isSuccess: isConfirmed,
    error,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClick = async () => {
    console.log('assetOne', assetOne.address);
    console.log('assetTwo', assetTwo.address);
    console.log('token1', BigInt(token1) * BigInt(10 ** 18));
    // console.log('dex_contract', process.env.DEX_CONTRACT! as `0x${string}`);
    writeContract({
      abi: dexAbi,
      address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
      functionName: 'addLiquidity',
      args: [
        assetOne.address,
        assetTwo.address,
        BigInt(token1) * BigInt(10 ** 18),
      ],
    });
  };

  const handleChangeToken1 = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0 && isNaN(value)) {
      setToken1('');
      setToken2('');
      return;
    }
    setToken1(String(value));
    const oppositeAmount = await getOppositeAmount(
      pool.address,
      pool.assetOne.address,
      value
    );
    setToken2(oppositeAmount);
  };

  const handleChangeToken2 = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setToken1('');
      setToken2('');
      return;
    }
    setToken2(String(value));
    const oppositeAmount = await getOppositeAmount(
      pool.address,
      pool.assetTwo.address,
      value
    );
    setToken1(oppositeAmount);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='token1'>{assetOne.name}</Label>
        <Input
          type='string'
          placeholder='0.00'
          onChange={(e) => handleChangeToken1(e)}
          value={token1}
        />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='token2'>{assetTwo.name}</Label>
        <Input
          type='string'
          placeholder='0.00'
          onChange={(e) => handleChangeToken2(e)}
          value={token2}
        />
      </div>
      {account.status === 'connected' ? (
        <div>
          {isPending ? (
            <Button disabled variant='ghost'>
              Loading
            </Button>
          ) : isRegister ? (
            <Button onClick={() => handleClick()}>Add Liquidity</Button>
          ) : (
            <RegisterToDexButton setIsRegistered={setIsRegistered} />
          )}
        </div>
      ) : (
        <Button disabled>Connect Wallet First</Button>
      )}

      {hash && <div>Transaction Hash: {hash}</div>}
      {isSuccess && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div className='text-xs italic text-red-900'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};
