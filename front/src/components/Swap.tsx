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
import {
  activePoolAddressAtom,
  activeTokenAtom,
  balanceAtom,
  swapAtom,
} from '@/lib/atom';
import { useAtom } from 'jotai';
import { CheckSwapLP } from './CheckSwapLP';
import { useEffect } from 'react';
import { getOppositeAmount, getPool } from '@/lib/pool.action';

interface SwapProps {
  tokens: Token[];
}

export const Swap = ({ tokens }: SwapProps) => {
  const [balance, setBalance] = useAtom(balanceAtom);
  const [activeToken, setActiveToken] = useAtom(activeTokenAtom);
  const [swap, setSwap] = useAtom(swapAtom);
  const [poolAddress, setPoolAddress] = useAtom(activePoolAddressAtom);

  const handleChange = () => {
    setActiveToken({
      token1: activeToken.token2,
      token2: activeToken.token1,
    });
    setBalance({
      balance1: balance.balance2,
      balance2: balance.balance1,
    });
    setSwap({
      amount1: swap.amount2,
      amount2: swap.amount1,
    });
  };

  useEffect(() => {
    const checkIfPoolExists = async (
      token1: `0x${string}`,
      token2: `0x${string}`
    ) => {
      try {
        const poolAddress = await getPool(token1, token2);
        setPoolAddress(poolAddress);
      } catch (error) {
        setPoolAddress(null);
      }
    };
    checkIfPoolExists(
      activeToken.token1?.address!,
      activeToken.token2?.address!
    );
    setSwap({
      amount1: 0,
      amount2: 0,
    });
  }, [activeToken]);

  const handleChangeValue = async (value: string, id: number) => {
    if (id === 1) {
      const amount2 = !poolAddress
        ? 0
        : await getOppositeAmount(
            poolAddress,
            activeToken.token2?.address!,
            BigInt(value)
          );
      setSwap({
        amount1: Number(value),
        amount2: Number(amount2),
      });
    } else {
      const amount1 = !poolAddress
        ? 0
        : await getOppositeAmount(
            poolAddress,
            activeToken.token2?.address!,
            BigInt(value)
          );
      setSwap({ amount1: Number(amount1), amount2: Number(value) });
    }
  };

  return (
    <div className='relative flex flex-col gap-4'>
      <div
        className='absolute flex items-center justify-center h-10 w-10 z-50 -right-14 top-[33%] 
      border border-accent dark:bg-[#38313d] rounded-xl shadow-lg cursor-pointer'
        onClick={() => handleChange()}
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
              onChange={(e) => handleChangeValue(e.target.value, 1)}
              value={swap.amount1}
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
              onChange={(e) => handleChangeValue(e.target.value, 2)}
              value={swap.amount2}
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
      <CheckSwapLP />
    </div>
  );
};
