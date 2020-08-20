import isIPFS from 'is-ipfs'
import { networkEnvironment } from '../current-environment'

export function getIpfsCidFromUri(uri) {
  const ipfsCid = uri.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }
  return ''
}

export function getIpfsUrlfromUri(uri) {
  const { ipfsGateway } = networkEnvironment
  return `${ipfsGateway}/${getIpfsCidFromUri(uri)}`
}
