import { getIpfsUrlFromUri } from '../lib/ipfs-utils'
import { KNOWN_APPS } from './apps-utils'

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
