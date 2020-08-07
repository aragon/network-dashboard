import { init as initSentry } from '@sentry/browser'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'
import { getNetworkEnvironment } from './networks'

const dsn = env('SENTRY_DSN')
const sentryEnabled = Boolean(dsn)
const chainId = getNetworkEnvironment(env('NETWORK_ENVIRONMENT')).chainId
const environment = getNetworkName(chainId)

export default function initializeSentry() {
  if (sentryEnabled) {
    initSentry({
      dsn,
      environment,
      release: 'network-dashboard@' + env('BUILD'),
    })
  }
}
