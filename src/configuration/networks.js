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
      subgraphs: {},
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
      orgLocation: 'ancashdaostaging2.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {},
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
      orgLocation: 'ancashdaostaging2.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {
        disputableVoting:
          'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-dvoting-rinkeby-staging',
        agreement:
          'https://api.thegraph.com/subgraphs/name/facuspagnuolo/aragon-agreement-rinkeby-staging',
      },
    },
  ],
])
