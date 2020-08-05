import { init as initSentry } from '@sentry/browser'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'

export const sentryEnabled = Boolean(env('SENTRY_DSN'))

export default function initializeSentry() {
  if (sentryEnabled) {
    initSentry({
      dsn: env('SENTRY_DSN'),
      environment: getNetworkName(env('CHAIN_ID')),
      release: 'network-dashboard@' + env('BUILD'),
    })
  }
}
