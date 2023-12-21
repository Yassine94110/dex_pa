import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className='bg-gradient-2 text-white'>
        <div className='flex flex-col justify-center items-center bg-gradient'>
          <div className='mb-16 flex flex-col justify-center items-center min-h-screen'>
            <h1 className='text-xl md:text-8xl text-center lg:w-[1024px]'>
              Swap, earn, and build on{' '}
              <span className='text-[#4457FF]'>the leading decentralized </span>
              crypto trading protocol.
            </h1>

            <Link href='https://t.me/waiter_x_bot'>
              <Button
                variant='secondary'
                className='h-10 w-[250px] rounded-md mt-8'
              >
                Launching the app
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
