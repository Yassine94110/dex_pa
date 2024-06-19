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
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export const DialogToken = () => {
  return (
    <Dialog>
      <DialogTrigger className='rounded-full border border-slate-800 flex gap-2 items-center justify-center pr-2 p-1 bg-black'>
        <Image src='/eth.png' alt='eth-logo' width={50} height={50} />
        ETH
        <ChevronDown />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            <Command>
              <CommandInput placeholder='Search name or paste address' />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Your tokens'>
                  <CommandToken
                    token='BTC'
                    short='Bitcoin'
                    howMany={1}
                    img='/btc.png'
                  />
                  <CommandToken
                    token='ETH'
                    short='Ethereum'
                    howMany={2}
                    img='/eth.png'
                  />
                  <CommandToken
                    token='ADA'
                    short='Cardano'
                    howMany={3}
                    img='/ada.png'
                  />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading='Popular tokens'>
                  <CommandToken
                    token='XRP'
                    short='Ripple'
                    howMany={4}
                    img='/xrp.png'
                  />
                  <CommandToken
                    token='LTC'
                    short='Litecoin'
                    howMany={5}
                    img='/ltc.png'
                  />
                  <CommandToken
                    token='BCH'
                    short='Bitcoin Cash'
                    howMany={6}
                    img='/bch.png'
                  />
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

interface CommandTokenProps {
  token: string;
  short: string;
  howMany: number;
  img: string;
}

const CommandToken = ({ token, short, howMany, img }: CommandTokenProps) => {
  return (
    <CommandItem className='flex justify-between'>
      <div className='flex items-center justify-center'>
        <Image src={img} alt={token + ' logo'} width={60} height={60} />
        <div className='flex flex-col gap-2'>
          <span>{token}</span>
          <span className='texte-slate-300 text-xs'>{short}</span>
        </div>
      </div>
      <span>{howMany}</span>
    </CommandItem>
  );
};
