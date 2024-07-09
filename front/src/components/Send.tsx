import { DialogToken } from './DialogToken';
import { BorderBeam } from './ui/border-beam';
import { Input } from './ui/input';
import ShinyButton from './ui/shiny-button';

export const Send = () => {
  return (
    <div className='relative flex flex-col gap-4'>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={160} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>Send</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-3xl font-medium flex-grow flex-1'
              defaultValue='0'
            />
            <DialogToken />
          </div>
        </div>
      </div>
      <div className='relative space-y-2 overflow-hidden px-3 border border-accent dark:bg-[#38313d] rounded-xl shadow-lg'>
        <BorderBeam size={160} duration={12} delay={9} borderWidth={2.5} />
        <div className='relative flex flex-col gap-2 py-3'>
          <span className='font-light text-slate-300'>To</span>
          <div className='flex justify-between'>
            <Input
              className='bg-transparent truncate appearance-none dark:text-slate-50 text-gray-900 w-full !ring-0 !outline-none min-h-[40px] h-[40px] py-2 border-0 p-0 !text-xl font-medium flex-grow flex-1'
              placeholder='Wallet address or ENS name'
            />
          </div>
        </div>
      </div>
      <ShinyButton text='Send' />
    </div>
  );
};
