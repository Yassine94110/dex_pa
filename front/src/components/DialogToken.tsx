'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { getBalanceOf, Token } from '@/lib/token.action';
import { useAtom } from 'jotai';
import { activeTokenAtom, balanceAtom, dialogOpenAtom } from '@/lib/atom';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

interface DialogTokenProps {
  tokens: Token[];
}

export const DialogToken = ({ tokens }: DialogTokenProps) => {
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [activeToken, setActiveToken] = useAtom(activeTokenAtom);
  const [balance, setBalance] = useAtom(balanceAtom);

  useEffect(() => {
    setActiveToken(tokens[0]);
  }, []);

  const account = useAccount();

  const handleSelect = (value: string) => {
    const token = tokens.find((token) => token.name === value);
    if (token) {
      setActiveToken(token);
      setOpen(false);
      console.log('token', token);
      if (!account.address) return;
      getBalanceOf(token.address, account.address).then((balance) => {
        if (!balance) return;
        console.log('balance', balance);
        setBalance(balance);
      });
    }
  };

  return (
    <div>
      <button
        className='rounded-full border border-slate-800 flex gap-2 items-center justify-center pr-2 p-1 bg-black'
        onClick={() => setOpen(true)}
      >
        <Image src='/logo-glx1.webp' alt='eth-logo' width={35} height={35} />
        {activeToken?.ticker}
        <ChevronDown />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search name or paste address' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Popular tokens'>
            {tokens.map((token: Token) => (
              <CommandItem
                key={token.id}
                className='flex justify-between cursor-pointer z-50'
                onSelect={(value) => handleSelect(value)}
              >
                <div className='flex items-center justify-center gap-4'>
                  <Image
                    src='/logo-glx1.webp'
                    alt={token + ' logo'}
                    width={45}
                    height={45}
                  />
                  <span>{token.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
