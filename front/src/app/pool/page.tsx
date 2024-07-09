import { PoolRow } from '@/components/PoolRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const page = () => {
  return (
    <div className='flex flex-col gap-4 justify-center'>
      <div className='rounded-lg bg-transparent flex flex-col h-[80vh] overflow-auto'>
        <Table>
          <TableHeader className=''>
            <TableRow>
              <TableHead className='w-[20px]'>#</TableHead>
              <TableHead>Pool</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>TVL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=''>
            {[...Array(20)].map((_, index) => (
              <PoolRow
                key={index}
                number={index + 1}
                token1='ETH'
                token2='BTC'
                transactions={2459935}
                tvl={3596300000}
                img1='/ethereum-cryptocurrency.svg'
                img2='/bitcoin-cryptocurrency.svg'
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
