export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'Ethereum'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}

/**
 * Check address equality without checksums
 * @param {string} first First address
 * @param {string} second Second address
 * @returns {boolean} Address equality
 */
export function addressesEqual(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}
