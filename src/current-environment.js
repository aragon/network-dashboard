import env from './environment'
import networks from './configuration/networks'

function getNetworkEnvironment(environment) {
  // Use custom config if it's been supplied
  if (environment.startsWith('{')) {
    try {
      return JSON.parse(environment)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  // Or a preset
  const preset = networks.get(environment)

  return {
    ...preset,
    orgLocation: env('ORG_LOCATION') || preset.orgLocation,
    ipfsGateway: env('IPFS_GATEWAY') || preset.ipfsGateway,
  }
}

export const networkEnvironment = getNetworkEnvironment(
  env('NETWORK_ENVIRONMENT')
)
