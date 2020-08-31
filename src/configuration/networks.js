export default new Map([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
      },
      orgLocation: 'cash.aragonnetwork.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {
        disputableVoting:
          'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-mainnet-staging',
        agreement:
          'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-mainnet-staging',
      },
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
      orgLocation: 'ancashdao.aragonid.eth',
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
      orgLocation: 'ancashdao.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {
        disputableVoting:
          'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-rinkeby-staging',
        agreement:
          'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby-staging',
      },
    },
  ],
])
