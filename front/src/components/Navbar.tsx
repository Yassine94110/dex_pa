'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BiMenuAltRight, BiWindowClose } from 'react-icons/bi';

const Navbar = () => {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  if (menu) document.body.style.overflow = 'hidden';

  const closeMenu = () => {
    setMenu(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className='text-white first-letter absolute top-0 w-full z-50'>
      <nav className='flex px-4 sm:px-12 py-8 bg-transparent justify-between'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='hidden md:block'>
            <Image src='/logo_nobg.png' alt='logo' width={50} height={50} />
          </Link>

          <div className='hidden md:flex gap-6'>
            <Link
              href='https://t.me/waiter_x_bot'
              className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                pathname === '/leaderboard' && 'text-[#4457FF]'
              }`}
            >
              Applications
            </Link>
            <Link
              href='/'
              className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                pathname === '/leaderboard' && 'text-[#4457FF]'
              }`}
            >
              Twitter
            </Link>
            <Link
              href='/'
              className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                pathname === '/leaderboard' && 'text-[#4457FF]'
              }`}
            >
              Discord
            </Link>
          </div>
        </div>

        <div className='xl:hidden flex gap-6 items-center'>
          {!menu && (
            <>
              <w3m-button />
              <button onClick={() => setMenu(true)}>
                <BiMenuAltRight size={50} />
              </button>
            </>
          )}
        </div>
      </nav>

      {menu && (
        <div className='absolute bg-black/30 w-full h-screen top-0 left-0'>
          <div className='absolute z-10 flex flex-col items-start top-0 left-0 p-4 pt-8 bg-[#2F3439] h-screen w-[350px]'>
            <button onClick={() => closeMenu()} className='absolute right-4'>
              <BiWindowClose size={50} className='text-[#ff000088]' />
            </button>

            <Link href='/'>
              <Image src='/logo_nobg.png' alt='logo' width={50} height={50} />
            </Link>

            <div className='flex flex-col justify-between h-full w-full'>
              <div className='flex flex-col gap-6 mt-8'>
                <Link
                  href='https://t.me/waiter_x_bot'
                  className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                    pathname === '/leaderboard' && 'text-[#4457FF]'
                  }`}
                >
                  Applications
                </Link>
                <Link
                  href='/'
                  className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                    pathname === '/leaderboard' && 'text-[#4457FF]'
                  }`}
                >
                  Twitter
                </Link>
                <Link
                  href='/'
                  className={`text-xl hover:text-[#4457FF] duration-300 ease-in-out ${
                    pathname === '/leaderboard' && 'text-[#4457FF]'
                  }`}
                >
                  Discord
                </Link>
              </div>

              <w3m-button />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
