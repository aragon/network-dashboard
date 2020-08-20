// TODO: Remove and replace with connect data
const connectedApp = {
  appName: 'Voting',
  collateralToken: {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    name: 'DAI Token',
    symbol: 'DAI',
  },
  actionAmount: '100000000000000000000',
  challengeAmount: '200000000000000000000',
  challengeDuration: 172800000,
}

export const MOCK_AGREEMENT = {
  contractAddress: '0x5c6620c49f9aecf74bd483054f2d0ace0d375f96',
  creationDate: '2020/07/20',
  ipfsUri: 'ipfs:Qmb5CHbQQQx6YXkPE6HodeXVmtCRgpSgkj9EkW9xs6jDHj',
  connectedApps: [connectedApp, connectedApp, connectedApp],
}
