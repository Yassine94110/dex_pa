import { PoolRow } from '@/components/PoolRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllPools, Pool } from '@/lib/pool.action';
import Link from 'next/link';

const page = async () => {
  const allPools = await getAllPools();
  console.log(allPools);
  return (
    <div className='flex flex-col gap-4 justify-center'>
      <div className='rounded-lg bg-transparent flex flex-col h-[80vh] overflow-auto'>
        <Table>
          <TableHeader className=''>
            <TableRow>
              <TableHead className='w-[20px]'>#</TableHead>
              <TableHead>Pool</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Asset1Lock</TableHead>
              <TableHead>Asset2Lock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=''>
            {allPools.map((pool: Pool, index: number) => (
              <PoolRow
                key={pool.address}
                number={index + 1}
                img1='/logo-glx1.webp'
                img2='/logo-glx1.webp'
                pool={pool}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
