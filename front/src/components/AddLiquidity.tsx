'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { getOppositeAmount, Pool } from '@/lib/pool.action';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

import { useAccount } from 'wagmi';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/lib/atom';
import { RegisterToDexButton } from './RegisterToDexButton';
import { isRegistered } from '@/lib/dex.action';
import { ButtonAddLiquidity } from './ButtonAddLiquidity';

export const AddLiquidity = ({ pool }: { pool: Pool }) => {
  const { assetOne, assetTwo } = pool;
  const [token, setToken] = useAtom(tokenAtom);
  const [isRegister, setIsRegistered] = useState(false);

  const account = useAccount();

  useEffect(() => {
    if (account.status === 'connected') {
      isRegistered(account.address).then((registered) => {
        setIsRegistered(registered);
      });
    }
  }, [account.address, account]);

  const handleChangeToken1 = async (e: ChangeEvent<HTMLInputElement>) => {
    const value1 = BigInt(e.target.value) * BigInt(10 ** 18);
    if (value1 < 0) {
      setToken({ value1: BigInt(0), value2: BigInt(0) });
      return;
    }
    const value2 = await getOppositeAmount(
      pool.address,
      pool.assetOne.address,
      value1
    );
    setToken({ value1, value2 });
  };

  const handleChangeToken2 = async (e: ChangeEvent<HTMLInputElement>) => {
    const value2 = BigInt(e.target.value) * BigInt(10 ** 18);
    if (value2 < 0) {
      setToken({ value1: BigInt(0), value2: BigInt(0) });
      return;
    }
    const value1 = await getOppositeAmount(
      pool.address,
      pool.assetTwo.address,
      value2
    );
    setToken({ value1, value2 });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='token1'>{assetOne.name}</Label>
        <Input
          type='string'
          placeholder='0.00'
          onChange={(e) => handleChangeToken1(e)}
          value={String(token.value1 / BigInt(10 ** 18))}
        />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='token2'>{assetTwo.name}</Label>
        <Input
          type='string'
          placeholder='0.00'
          onChange={(e) => handleChangeToken2(e)}
          value={String(token.value2 / BigInt(10 ** 18))}
        />
      </div>
      {account.status === 'connected' ? (
        <div>
          {!isRegister && (
            <RegisterToDexButton setIsRegistered={setIsRegistered} />
          )}
          {isRegister && <ButtonAddLiquidity pool={pool} />}
        </div>
      ) : (
        <Button disabled>Connect Wallet First</Button>
      )}
    </div>
  );
};
