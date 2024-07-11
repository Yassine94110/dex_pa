'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import ShinyButton from './ui/shiny-button';

export const AddLiquidity = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' placeholder='Email' />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' placeholder='Email' />
      </div>
      <ShinyButton text='Add' />
    </div>
  );
};
