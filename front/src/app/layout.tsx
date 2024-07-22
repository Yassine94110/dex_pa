import type { Metadata } from 'next';
import './globals.css';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import Web3ModalProvider from '@/lib/context';
import { config } from '@/lib/config';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/Navbar';
import RadialGradient from '@/components/ui/radial-gradient';
import { Vortex } from '@/components/ui/vortex';
import { Provider } from 'jotai';
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: 'Galaxy Swap',
  description:
    'Explore the vastness of cryptocurrency trading with Galaxy Swap, your premier platform for seamless exchanges.',
  icons: '/logo-glx.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'));
  return (
    <html lang='en'>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <Provider>
            <Web3ModalProvider initialState={initialState}>
              <Navbar />
              <main className='relative overflow-hidden flex flex-col max-h-[100vh] h-[100vh]'>
                <Vortex
                  backgroundColor='black'
                  rangeY={100}
                  particleCount={200}
                  baseHue={80}
                  className='px-2 md:px-10  pb-4 pt-32'
                >
                  {children}
                </Vortex>
              </main>
              <Toaster />
              <RadialGradient />
            </Web3ModalProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
