import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

// Define Somnia Mainnet
const somnia = defineChain({
  id: 2019,
  name: 'Somnia',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://jsonrpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://somnia.network' },
  },
})

// Define Somnia Testnet
const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Testnet Explorer', url: 'https://shannon-explorer.somnia.network' },
  },
  testnet: true,
})

export const config = getDefaultConfig({
  appName: 'Mine & Escape',
  projectId: '2e5dce1e2345d8c9be426aff5a3b3cd1',
  chains: [somnia, somniaTestnet, mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
})