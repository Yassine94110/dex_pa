import { TokenRow } from '@/components/TokenRow';
import { Input } from '@/components/ui/input';
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
      <Input placeholder='Search a token' className='max-w-xs' />
      <Table className='max-w-2xl min-w-96 dark:bg-[#38313ddc] rounded-xl shadow-xl border border-accent overflow-clip'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[20px]'>#</TableHead>
            <TableHead>Token name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TokenRow
            number={1}
            token='Token Name'
            short='TKN'
            price={0.0}
            volume={0.0}
            img='/eth.png'
          />
          <TokenRow
            number={2}
            token='Token Name 2'
            short='TKN2'
            price={0.0}
            volume={0.0}
            img='/eth.png'
          />
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
