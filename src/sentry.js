import { init as initSentry } from '@sentry/browser'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'
import { networkEnvironment } from './current-environment'

const dsn = env('SENTRY_DSN')
const sentryEnabled = Boolean(dsn)
const { chainId } = networkEnvironment
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
