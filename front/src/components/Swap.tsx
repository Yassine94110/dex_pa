import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BorderBeam } from './ui/border-beam';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import ShinyButton from './ui/shiny-button';

export const Swap = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={130} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Sell</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              defaultValue='0'
            />
            <Dialog>
              <DialogTrigger className='rounded-full border border-slate-800 flex gap-2 items-center justify-center pr-2 p-1 bg-black'>
                <Image src='/eth.png' alt='eth-logo' width={50} height={50} />
                ETH
                <ChevronDown />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={130} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Buy</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              defaultValue='0'
            />
            <Dialog>
              <DialogTrigger className='rounded-full border border-slate-800 flex gap-2 items-center justify-center pr-2 p-1 bg-black'>
                <Image src='/eth.png' alt='eth-logo' width={50} height={50} />
                ETH
                <ChevronDown />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <ShinyButton text='Swap' />
    </div>
  );
};
