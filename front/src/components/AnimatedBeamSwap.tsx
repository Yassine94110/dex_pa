'use client';

import React, { forwardRef, useRef } from 'react';

import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { User } from 'lucide-react';
import Image from 'next/image';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = 'Circle';

export function AnimatedBeamSwap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className='relative flex w-full max-w-[500px] -translate-x-56 overflow-hidden'
      ref={containerRef}
    >
      <div className='flex h-full w-full flex-col items-stretch justify-between gap-10'>
        <div className='flex flex-row justify-between'>
          <Circle ref={div1Ref}>
            <User color='black' />
          </Circle>
          <Circle ref={div2Ref}>
            <Image src='/atom.svg' alt='galaxy' width={50} height={50} />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-20}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={-10}
        endYOffset={-10}
        curvature={20}
        reverse
      />
    </div>
  );
}
