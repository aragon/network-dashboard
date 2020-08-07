import env from './environment'

const DEFAULT_IPFS_GATEWAY = 'https://ipfs.eth.aragon.network/ipfs'
const DEFAULT_ORG_LOCATION = 'agreement3.aragonid.eth'

const NETWORK_ENVIRONMENTS = new Map([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      ensAddress: '',
      nodes: {
        defaultEth: 'https://mainnet.eth.aragon.network/',
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      ensAddress: '',
      nodes: {
        defaultEth: 'https://rinkeby.eth.aragon.network/',
      },
    },
  ],
  [
    'rinkeby-staging',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      ensAddress: '',
      nodes: {
        defaultEth: 'https://rinkeby.eth.aragon.network/',
      },
    },
  ],
])

export function getNetworkEnvironment(environment) {
  // If custom config supplied
  if (environment.startsWith('{')) {
    return JSON.parse(environment)
  }

  // Or use preset
  return NETWORK_ENVIRONMENTS.get(environment)
}

export const orgLocation = env('ORG_LOCATION') || DEFAULT_ORG_LOCATION

export const defaultIpfsGateway =
  env('DEFAULT_IPFS_GATEWAY') || DEFAULT_IPFS_GATEWAY
