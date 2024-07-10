import Image from 'next/image';
import { TableCell, TableRow } from './ui/table';

interface PoolRowProps {
  number: number;
  token1: string;
  token2: string;
  transactions: number;
  img1: string;
  img2: string;
  assetOneLock: bigint;
  assetTwoLock: bigint;
}

export const PoolRow = ({
  number,
  token1,
  token2,
  transactions,
  img1,
  img2,
  assetOneLock,
  assetTwoLock,
}: PoolRowProps) => {
  return (
    <TableRow>
      <TableCell className='font-medium'>{number}</TableCell>
      <TableCell>
        <div className='flex items-center uppercase gap-4'>
          <div className='flex justify-center'>
            <div className='relative flex'>
              <div className='relative'>
                <Image
                  src={img1}
                  alt={`${token1}/${token2}-logo`}
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
                  alt={`${token1}/${token2}-logo`}
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
          {token1}/{token2}
        </div>
      </TableCell>
      <TableCell>{transactions}</TableCell>
      <TableCell>{assetOneLock}</TableCell>
      <TableCell>{assetTwoLock}</TableCell>
    </TableRow>
  );
};
