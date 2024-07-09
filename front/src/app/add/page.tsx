import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const page = () => {
  return (
    <div className='flex justify-center items-center'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle>Add Liquidity</CardTitle>
          <CardDescription>
            Provide liquidity to the pool and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='token1'>Token 1</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select token' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='eth'>Ethereum (ETH)</SelectItem>
                    <SelectItem value='usdc'>USD Coin (USDC)</SelectItem>
                    <SelectItem value='dai'>Dai (DAI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='amount1'>Amount</Label>
                <Input id='amount1' type='number' placeholder='0.0' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='token2'>Token 2</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select token' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='eth'>Ethereum (ETH)</SelectItem>
                    <SelectItem value='usdc'>USD Coin (USDC)</SelectItem>
                    <SelectItem value='dai'>Dai (DAI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='amount2'>Amount</Label>
                <Input id='amount2' type='number' placeholder='0.0' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='total'>Total Liquidity</Label>
              <Input id='total' type='number' placeholder='0.0' readOnly />
            </div>
            <div className='space-y-2'>
              <Label>Your Share</Label>
              <div className='flex items-center gap-2'>
                <div className='text-2xl font-bold'>12.34%</div>
                <div className='text-muted-foreground'>of the pool</div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type='submit' className='ml-auto'>
            Add Liquidity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
