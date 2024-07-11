import { PoolRow } from '@/components/PoolRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllPools, Pool } from '@/lib/pool.action';

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
                key={index}
                number={index + 1}
                token1={pool.assetOne.symbol}
                token2={pool.assetTwo.symbol}
                transactions={2459935}
                img1='/logo-glx1.webp'
                img2='/logo-glx1.webp'
                assetOneLock={pool.assetOneLock / BigInt(10 ** 18)}
                assetTwoLock={pool.assetTwoLock / BigInt(10 ** 18)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
