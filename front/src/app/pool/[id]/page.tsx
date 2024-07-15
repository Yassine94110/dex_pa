import { AddLiquidity } from '@/components/AddLiquidity';
import { Chart } from '@/components/Chart';
import { isRegistered } from '@/lib/dex.action';
import { getPoolInformation } from '@/lib/pool.action';

const page = async ({ params }: { params: { id: string } }) => {
  const pool = await getPoolInformation(params.id as `0x${string}`);
  return (
    <div className='flex justify-center gap-12'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Pool Information</h1>
        <div className='flex flex-col gap-4 mt-8 pl-4'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>Pool Address</span>
            <span className='text-xs text-slate-400'>{pool.address}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>
              {pool.assetOne.name} ({pool.assetOne.symbol})
            </span>
            <span className='text-xs text-slate-400'>
              {pool.assetOne.address}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>
              {pool.assetTwo.name} ({pool.assetTwo.symbol})
            </span>
            <span className='text-xs text-slate-400'>
              {pool.assetTwo.address}
            </span>
          </div>
        </div>
        <h1 className='text-2xl font-bold my-8'>Add Liquidity</h1>
        <div className='pl-4 max-w-80'>
          <AddLiquidity pool={pool} />
        </div>
      </div>
      <Chart pool={pool} />
    </div>
  );
};

export default page;
