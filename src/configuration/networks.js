export default new Map([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      courtUrl: 'https://court.aragon.org',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
      },
      orgLocation: 'cash.aragonnetwork.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {
        organization:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-mainnet',
        disputableVoting:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-dvoting-mainnet-staging',
        agreement:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-agreement-mainnet-staging',
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      courtUrl: 'https://court-rinkeby.aragon.org',
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
      courtUrl: 'https://court-staging.aragon.org',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
      },
      orgLocation: 'ancashdao.aragonid.eth',
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      subgraphs: {
        organization:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-rinkeby-staging',
        disputableVoting:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-dvoting-rinkeby-staging',
        agreement:
          'https://graph.backend.aragon.org/subgraphs/name/aragon/aragon-agreement-rinkeby-staging',
      },
    },
  ],
])
