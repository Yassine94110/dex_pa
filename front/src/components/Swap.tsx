'use client';

import { Input } from '@/components/ui/input';
import { BorderBeam } from './ui/border-beam';
import { ArrowDownUp } from 'lucide-react';
import ShinyButton from './ui/shiny-button';
import { DialogToken } from './DialogToken';
import { Token } from '@/lib/token.action';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { balanceAtom } from '@/lib/atom';
import { useAtom } from 'jotai';

interface SwapProps {
  tokens: Token[];
}

export const Swap = ({ tokens }: SwapProps) => {
  const [balance] = useAtom(balanceAtom);
  const account = useAccount();

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const handleSwap = async () => {
    // writeContract({
    //   address: process.env.NEXT_PUBLIC_DEX_CONTRACT! as `0x${string}`,
    //   abi: dexAbi,
    //   functionName: 'swap',
    //   args: [],
    // });
  };

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <div className='relative flex flex-col gap-4'>
      <div
        className='absolute flex items-center justify-center h-10 w-10 z-50 -right-14 top-[33%] 
      border border-accent dark:bg-[#38313d] rounded-xl shadow-lg cursor-pointer'
      >
        <ArrowDownUp />
      </div>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={160} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Sell</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              defaultValue='0'
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
        <BorderBeam
          size={160}
          duration={12}
          delay={9}
          borderWidth={2.5}
          anchor={90}
        />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Buy</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              defaultValue='0'
            />
            <DialogToken tokens={tokens} id={2} />
          </div>
          <div>
            <span className='text-xs text-slate-400'>
              Balance:{' '}
              {balance.balance2
                ? Number(balance.balance2 / BigInt(10 ** 18))
                : 0}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSwap()}
        disabled={account.status !== 'connected'}
      >
        <ShinyButton
          text={
            account.status !== 'connected'
              ? 'Connect Your Wallet First'
              : 'Swap'
          }
        />
      </button>
    </div>
  );
};
