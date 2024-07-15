import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'GalaxySwap Protocol',
  description: 'GalaxySwap Protocol decentralized exchange',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['/logo-glx1.webp'],
};

export const config = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata,
  enableInjected: true,
  enableWalletConnect: true,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
