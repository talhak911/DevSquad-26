import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { defineChain } from 'viem'

/**
 * Kasplex Testnet chain definition.
 * Chain ID 165988 (0x28c64) — matches the MetaMask-registered network.
 *
 * NOTE: mainnet/sepolia are intentionally excluded.
 * Their default public RPCs (eth.merkle.io etc.) block browser-side CORS
 * requests and cause console errors when wagmi tries to batch-call them.
 */
export const kasplexTestnet = defineChain({
  id: 167012,           // 0x28c64 — confirmed from MetaMask
  name: 'Kasplex Testnet',
  nativeCurrency: {
    name: 'KAS',
    symbol: 'KAS',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.kasplextest.xyz'] },
  },
  // Explorer URL removed — explorer.kasplextest.xyz does not resolve (DNS error)
  testnet: true,
})

export function getConfig() {
  return createConfig({
    chains: [kasplexTestnet],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      // Route reads through our Next.js API proxy (/api/rpc) to avoid CORS.
      // The browser calls localhost:3000/api/rpc → Next.js server forwards to
      // rpc.kasplextest.xyz server-side (no CORS restrictions apply).
      [kasplexTestnet.id]: http('/api/rpc'),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
