import type { Metadata } from 'next';
import './globals.css';
import { Web3Modal } from '@/components/Web3Modal';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Web3Modal>
          <Navbar />
          {children}
        </Web3Modal>
      </body>
    </html>
  );
}
