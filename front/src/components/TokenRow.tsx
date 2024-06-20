import Image from 'next/image';
import { TableCell, TableRow } from './ui/table';

interface TokenRowProps {
  number: number;
  token: string;
  short: string;
  price: number;
  volume: number;
  img: string;
}

export const TokenRow = ({
  number,
  token,
  short,
  price,
  volume,
  img,
}: TokenRowProps) => {
  return (
    <TableRow>
      <TableCell className='font-medium'>{number}</TableCell>
      <TableCell>
        <div className='flex items-center'>
          <Image src={img} alt={`${short}-logo`} width={50} height={50} />
          {token} - {short}
        </div>
      </TableCell>
      <TableCell>${price.toFixed(2)}</TableCell>
      <TableCell>${volume.toFixed(1)}M</TableCell>
    </TableRow>
  );
};
