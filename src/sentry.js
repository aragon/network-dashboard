import {
  init as initSentry,
  captureMessage,
  captureException,
} from '@sentry/browser'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'
import { networkEnvironment } from './current-environment'

const dsn = env('SENTRY_DSN')
const { chainId } = networkEnvironment
const environment = getNetworkName(chainId)

export const sentryEnabled = Boolean(dsn)

export default function initializeSentry() {
  if (sentryEnabled) {
    initSentry({
      dsn,
      environment,
      release: 'network-dashboard@' + env('BUILD'),
    })
  }
}

export function logWithSentry(message, level = 'warning') {
  if (sentryEnabled) {
    captureMessage(message, level)
  }
}

export function captureErrorWithSentry(err) {
  if (sentryEnabled) {
    captureException(err)
  }
}
