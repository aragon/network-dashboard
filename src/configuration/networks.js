export default new Map([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
      },
      orgLocation: '',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
      },
      orgLocation: 'agreement3.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    },
  ],
  [
    'rinkeby-staging',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
      },
      orgLocation: 'agreement3.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    },
  ],
])
