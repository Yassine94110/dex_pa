'use client';

import {
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
  id: 1 | 2;
}

export const DialogToken = ({ tokens, id }: DialogTokenProps) => {
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [activeToken, setActiveToken] = useAtom(activeTokenAtom);
  const [_, setBalance] = useAtom(balanceAtom);

  useEffect(() => {
    setActiveToken({ token1: tokens[0], token2: tokens[0] });
  }, []);

  const account = useAccount();

  const handleSelect = (value: string) => {
    const token = tokens.find((token) => token.name === value);
    if (!token) return;
    setActiveToken((prev) =>
      id === 1 ? { ...prev, token1: token } : { ...prev, token2: token }
    );
    console.log('token', token);
    if (!account.address) return;
    getBalanceOf(token.address, account.address).then((balance) => {
      if (!balance) return;
      console.log('balance', balance);
      if (id === 1) setBalance((prev) => ({ ...prev, balance1: balance }));
      if (id === 2) setBalance((prev) => ({ ...prev, balance2: balance }));
    });
    setOpen({ open1: false, open2: false });
  };

  return (
    <div>
      <button
        className='rounded-full border border-slate-800 flex gap-2 items-center justify-center pr-2 p-1 bg-black'
        onClick={() =>
          setOpen({
            open1: id === 1 ? !open.open1 : open.open1,
            open2: id === 2 ? !open.open2 : open.open2,
          })
        }
      >
        <Image src='/logo-glx1.webp' alt='eth-logo' width={35} height={35} />
        {id === 1 ? activeToken.token1?.name : activeToken.token2?.name}
        <ChevronDown />
      </button>
      <CommandDialog
        open={id === 1 ? open.open1 : open.open2}
        onOpenChange={(value) =>
          setOpen({
            open1: id === 1 ? value : open.open1,
            open2: id === 2 ? value : open.open2,
          })
        }
      >
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
