'use client';

import { OrbitingCirclesSwap } from '@/components/OrbitingCircleSwap';
import { TextGenerateEffect } from '@/components/ui/text-effect';

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
