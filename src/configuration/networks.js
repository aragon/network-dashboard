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
      disputableVotingApp: '',
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
      disputableVotingApp: '0x26e14ed789b51b5b226d69a5d40f72dc2d0180fe',
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
      disputableVotingApp: '0x26e14ed789b51b5b226d69a5d40f72dc2d0180fe',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
    },
  ],
])
