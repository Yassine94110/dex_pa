import { TokenRow } from '@/components/TokenRow';
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
              <TableHead>Token name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=''>
            {[...Array(20)].map((_, index) => (
              <TokenRow
                key={index}
                number={index + 1}
                token={`Token Name ${index + 1}`}
                short={`TKN${index + 1}`}
                price={0.0}
                volume={0.0}
                img='/eth.png'
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
