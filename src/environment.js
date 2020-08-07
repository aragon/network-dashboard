// Rinkeby
const DEFAULT_NETWORK_ENVIRONMENT = 'rinkeby'

const ENV_VARS = {
  BUILD() {
    return process.env.BUILD || 'undefined'
  },
  NETWORK_ENVIRONMENT() {
    return process.env.NETWORK_ENVIRONMENT || DEFAULT_NETWORK_ENVIRONMENT
  },
  IPFS_GATEWAY() {
    return process.env.IPFS_GATEWAY || ''
  },
  ORG_LOCATION() {
    return process.env.ORG_LOCATION || ''
  },
  FORTMATIC_API_KEY() {
    return process.env.FORTMATIC_API_KEY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.PORTIS_DAPP_ID || ''
  },
  SENTRY_DSN() {
    const dsn = process.env.SENTRY_DSN || ''
    return dsn.trim()
  },
}

// Error on invalid accesses to ENV_VARS
const PROTECTED_ENV_VARS = new Proxy(ENV_VARS, {
  get(target, property) {
    if (property in target) {
      return target[property]
    } else {
      throw new Error(
        `Environment variable '${property}' is not defined! Ensure it exists in environment.js`
      )
    }
  },
})

export default function env(name) {
  const envVar = PROTECTED_ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
