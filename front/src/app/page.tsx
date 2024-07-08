'use client';

import OrbitingCircles from '@/components/ui/orbiting-circles';
import Image from 'next/image';
import { TextGenerateEffect } from '@/components/ui/text-effect';
import { AnimatedBeamSwap } from '@/components/AnimatedBeamSwap';

const page = () => {
  const words = `Swap, earn, and build on the leading decentralized crypto trading protocol.`;
  return (
    <div>
      <h1 className='text-6xl font-bold'>GalaxySwap Protocol</h1>
      <TextGenerateEffect words={words} />
      <OrbitingCirclesSwap />
    </div>
  );
};

export default page;

export function OrbitingCirclesSwap() {
  return (
    <div className='relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden'>
      <OrbitingCircles
        className='size-[30px] border-none bg-transparent'
        duration={20}
        delay={20}
        radius={80}
      >
        <Image
          src='/bitcoin-cryptocurrency.svg'
          alt='bitcoin'
          width={50}
          height={50}
        />
      </OrbitingCircles>
      <AnimatedBeamSwap />
      <OrbitingCircles
        className='size-[30px] border-none bg-transparent'
        duration={20}
        delay={10}
        radius={80}
      >
        <Image
          src='/ethereum-cryptocurrency.svg'
          alt='ethereum'
          width={50}
          height={50}
        />
      </OrbitingCircles>
      <OrbitingCircles
        className='size-[50px] border-none bg-transparent'
        radius={190}
        duration={20}
        reverse
      >
        <Image src='/matic.png' alt='bitcoin' width={200} height={200} />
      </OrbitingCircles>
      <OrbitingCircles
        className='size-[50px] border-none bg-transparent'
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <Image src='/usdt.png' alt='bitcoin' width={50} height={50} />
      </OrbitingCircles>
    </div>
  );
}
