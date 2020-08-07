export function getNetworkType(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'main'
  if (chainId === '4') return 'rinkeby'

  return null
}

export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'Ethereum'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}
