import env from './environment'
import { getNetworkType } from './lib/web3-utils'

const DEFAULT_IPFS_GATEWAY = 'https://ipfs.eth.aragon.network/ipfs'

export const networkConfigs = {
  main: {
    orgLocation: '',
    nodes: {
      defaultEth: 'https://mainnet.eth.aragon.network/',
    },
  },
  rinkeby: {
    orgLocation: 'agreement3.aragonid.eth',
    nodes: {
      defaultEth: 'https://rinkeby.eth.aragon.network/',
    },
  },
}

function getNetworkConfig(chainId) {
  return networkConfigs[getNetworkType(chainId)]
}

export function getDefaultEthNode(chainId) {
  return env('DEFAULT_ETH_NODE') || getNetworkConfig(chainId).nodes.defaultEth
}

export function getOrgLocation(chainId) {
  return env('ORG_LOCATION') || getNetworkConfig(chainId).orgLocation
}

export const defaultIpfsGateway =
  env('DEFAULT_IPFS_GATEWAY') || DEFAULT_IPFS_GATEWAY
