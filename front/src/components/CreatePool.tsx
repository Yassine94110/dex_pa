'use client';

import { Token } from '@/lib/token.action';
import { DialogToken } from './DialogToken';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAtom } from 'jotai';
import { balanceAtom, tokenAtom } from '@/lib/atom';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { isAdmin } from '@/lib/dex.action';
import { toast } from 'sonner';

interface CreatePoolProps {
  tokens: Token[];
}

export const CreatePool = ({ tokens }: CreatePoolProps) => {
  const [balance, setBalance] = useAtom(balanceAtom);
  const [amount, setAmount] = useAtom(tokenAtom);
  const account = useAccount();

  useEffect(() => {
    isAdmin(account.address!).then((isAdmin) => {
      if (!isAdmin)
        toast.error(
          'You are not an admin, you will not be able to create a pool'
        );
      else toast.success('You are an admin');
    });
  }, [account.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (id === 1) {
      if (balance.balance1 === null) return;
      if (BigInt(e.target.value) > balance.balance1) return;
      setAmount((prev) => ({
        ...prev,
        value1: BigInt(e.target.value) * BigInt(10 ** 18),
      }));
    } else {
      if (balance.balance2 === null) return;
      if (BigInt(e.target.value) > balance.balance2) return;
      setAmount((prev) => ({
        ...prev,
        value2: BigInt(e.target.value) * BigInt(10 ** 18),
      }));
    }
  };

  return (
    <div className='grid gap-6'>
      <div className='grid grid-cols-3 gap-2 items-center'>
        <div className='space-y-2'>
          <Label htmlFor='token1'>Token 1</Label>
          <DialogToken tokens={tokens} id={1} />
        </div>
        <div className='space-y-2 col-span-2'>
          <Label htmlFor='amount1'>Amount</Label>
          <Input
            placeholder='0.0'
            value={String(amount.value1 / BigInt(10 ** 18))}
            onChange={(e) => handleChange(e, 1)}
          />
        </div>
        <span className='text-xs text-slate-400'>
          Balance:{' '}
          {balance.balance1 ? Number(balance.balance1 / BigInt(10 ** 18)) : 0}
        </span>
      </div>

      <div className='grid grid-cols-3 gap-2 items-center'>
        <div className='space-y-2'>
          <Label htmlFor='token2'>Token 2</Label>
          <DialogToken tokens={tokens} id={2} />
        </div>
        <div className='space-y-2 col-span-2'>
          <Label htmlFor='amount2'>Amount</Label>
          <Input
            placeholder='0.0'
            value={String(amount.value2 / BigInt(10 ** 18))}
            onChange={(e) => handleChange(e, 2)}
          />
        </div>
        <span className='text-xs text-slate-400'>
          Balance:{' '}
          {balance.balance2 ? Number(balance.balance2 / BigInt(10 ** 18)) : 0}
        </span>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='total'>Total Liquidity</Label>
        <Input
          value={String((amount.value1 + amount.value2) / BigInt(10 ** 18))}
          readOnly
        />
      </div>
      <div className='space-y-2'>
        <Label>Your Share</Label>
        <div className='flex items-center gap-2'>
          <div className='text-2xl font-bold'>100%</div>
          <div className='text-muted-foreground'>of the pool</div>
        </div>
      </div>
    </div>
  );
};
