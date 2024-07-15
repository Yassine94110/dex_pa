import { TokenRow } from '@/components/TokenRow';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllTokens,Token } from '@/lib/token.action';


const page = async () => {
  const allTokens = await getAllTokens();

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
            {allTokens.map((token: Token, index: number) => (
              <TokenRow
                key={token.id}
                number={token.id}
                token={token.name}
                short={token.ticker}
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
