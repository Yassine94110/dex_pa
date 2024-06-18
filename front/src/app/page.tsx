import { Navbar } from '@/components/Navbar';
import RadialGradient from '@/components/ui/radial-gradient';
import { Vortex } from '@/components/ui/vortex';

export default function Home() {
  return (
    <main className='relative overflow-hidden flex flex-col max-h-[100vh] h-[100vh]'>
      <Vortex
        backgroundColor='black'
        rangeY={100}
        particleCount={200}
        baseHue={80}
        className='flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full'
      >
        <div className='flex justify-center items-center'>
          <p>FHUZHOFZ</p>
          <RadialGradient />
        </div>
      </Vortex>
    </main>
  );
}
