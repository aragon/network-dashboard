import { getIpfsUrlFromUri } from '../lib/ipfs-utils'
import { KNOWN_APPS } from '../utils/app-utils'
import env from '../environment'

export const DEFAULT_LOCAL_CHAIN = 'private'

export function getNetworkType(chainId = env('CHAIN_ID')) {
  chainId = String(chainId)

  if (chainId === '1') return 'main'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'Ethereum'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
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

export function getAppPresentation(apps, appAddress) {
  const { contentUri, manifest, appId } = apps.find(
    ({ address }) => address === appAddress
  )
  let iconSrc = ''
  let humanName = ''
  if (manifest && manifest.name) {
    humanName = manifest.name
  }

  if (manifest && manifest.icons && manifest.icons[0]) {
    const iconPath = manifest.icons[0].src
    iconSrc = getIpfsUrlFromUri(contentUri) + iconPath
  }

  if (KNOWN_APPS.get(appId)) {
    humanName = KNOWN_APPS.get(appId).humanName
    iconSrc = KNOWN_APPS.get(appId).iconSrc
  }

  return { humanName, iconSrc }
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}
