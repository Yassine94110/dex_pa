'use client';

import { BorderBeam } from './ui/border-beam';
import { Input } from './ui/input';
import ShinyButton from './ui/shiny-button';
import { DialogToken } from './DialogToken';
import { useAtom } from 'jotai';
import { activeTokenAtom, balanceAtom, sendAtom } from '@/lib/atom';
import { getBalanceOf, Token } from '@/lib/token.action';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { erc20Abi, isAddress } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { BaseError } from '@wagmi/core';

interface SendProps {
  tokens: Token[];
}

export const Send = ({ tokens }: SendProps) => {
  const [balance, setBalance] = useAtom(balanceAtom);
  const [send, setSend] = useAtom(sendAtom);
  const [activeToken] = useAtom(activeTokenAtom);
  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleSend = async () => {
    console.log('send', send);
    writeContract({
      address: activeToken?.token1?.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [send.to as `0x${string}`, BigInt(send.amount) * BigInt(10 ** 18)],
    });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction success');
      if (!account.address) return;
      if (!activeToken.token1?.address) return;
      getBalanceOf(activeToken?.token1.address, account.address).then(
        (balance) => {
          if (!balance) return;
          console.log('balance', balance);
          setBalance((prev) => ({ ...prev, balance1: balance }));
        }
      );
    }
  }, [isSuccess]);

  return (
    <div className='relative flex flex-col gap-4'>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={160} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Send</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              value={send.amount}
              onChange={(e) =>
                setSend({ ...send, amount: Number(e.target.value) })
              }
            />
            <DialogToken tokens={tokens} id={1} />
          </div>
          <div>
            <span className='text-xs text-slate-400'>
              Balance:{' '}
              {balance.balance1
                ? Number(balance.balance1 / BigInt(10 ** 18))
                : 0}
            </span>
          </div>
        </div>
      </div>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={160} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>To</span>
          <Input
            className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-xl font-medium flex-grow flex-1'
            placeholder='Wallet address or ENS name'
            value={send.to}
            onChange={(e) => setSend({ ...send, to: e.target.value })}
          />
        </div>
      </div>
      <button
        onClick={() => handleSend()}
        disabled={
          account.status !== 'connected' ||
          BigInt(send.amount) * BigInt(10 ** 18) > balance.balance1! ||
          BigInt(send.amount) < 0 ||
          !isAddress(send.to) ||
          isPending ||
          isLoading
        }
      >
        <ShinyButton
          text={
            account.status !== 'connected'
              ? 'Connect Your Wallet First'
              : BigInt(send.amount) * BigInt(10 ** 18) > balance.balance1!
              ? 'Not enought balance'
              : BigInt(send.amount) <= 0
              ? 'Set An Amount'
              : !isAddress(send.to)
              ? 'Set A Valid Address'
              : isLoading || isPending
              ? 'Pending...'
              : 'Send'
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
