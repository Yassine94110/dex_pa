import ShinyButton from '@/components/ui/shiny-button';
import Link from 'next/link';

const page = () => {
  return (
    <div>
      <Link href='/add'>
        <ShinyButton text='+ Add Liquidity' />
      </Link>
    </div>
  );
};

export default page;
