import { AnimatedBeamSwap } from '@/components/AnimatedBeamSwap';
import OrbitingCircles from '@/components/ui/orbiting-circles';
import Image from 'next/image';

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
        className='size-[40px] border-none bg-transparent'
        radius={140}
        duration={20}
        reverse
      >
        <Image src='/matic.png' alt='bitcoin' width={500} height={500} />
      </OrbitingCircles>
      <OrbitingCircles
        className='size-[40px] border-none bg-transparent'
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
