'use client';

import Image from 'next/image';
import { TableCell, TableRow } from './ui/table';
import { useRouter } from 'next/navigation';
import { Pool } from '@/lib/pool.action';

interface PoolRowProps {
  number: number;
  pool: Pool;
  img1: string;
  img2: string;
}

export const PoolRow = ({ pool, number, img1, img2 }: PoolRowProps) => {
  const router = useRouter();
  const { assetOneLock, assetTwoLock, assetOne, assetTwo } = pool;
  return (
    <TableRow
      onClick={() => router.push(`/pool/${pool.address}`)}
      className='cursor-pointer'
    >
      <TableCell className='font-medium'>{number}</TableCell>
      <TableCell>
        <div className='flex items-center uppercase gap-4'>
          <div className='flex justify-center'>
            <div className='relative flex'>
              <div className='relative'>
                <Image
                  src={img1}
                  alt={`${assetOne.symbol}-logo`}
                  layout='fixed'
                  width={30}
                  height={30}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                  }}
                  className='absolute z-50'
                />
                <Image
                  src={img2}
                  alt={`${assetTwo.symbol}-logo`}
                  layout='fixed'
                  width={30}
                  height={30}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                    marginLeft: '-50%',
                  }}
                />
              </div>
            </div>
          </div>
          {assetOne.symbol}/{assetTwo.symbol}
        </div>
      </TableCell>
      <TableCell>{232342}</TableCell>
      <TableCell>{Number(assetOneLock / BigInt(10 ** 18))}</TableCell>
      <TableCell>{Number(assetTwoLock / BigInt(10 ** 18))}</TableCell>
    </TableRow>
  );
};
