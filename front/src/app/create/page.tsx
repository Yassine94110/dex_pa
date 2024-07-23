import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { getAllTokens } from '@/lib/token.action';
import { CreatePool } from '@/components/CreatePool';
import { ButtonCreateLiquidityPool } from '@/components/ButtonCreateLiquidityPool';

const page = async () => {
  const tokens = await getAllTokens();
  return (
    <div className='flex justify-center items-center'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle>Create Liquidity Pool</CardTitle>
          <CardDescription>
            Provide liquidity to the pool and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePool tokens={tokens} />
        </CardContent>
        <CardFooter>
          <ButtonCreateLiquidityPool />
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
