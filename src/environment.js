// Rinkeby
const DEFAULT_CHAIN_ID = 4

const ENV_VARS = {
  BUILD() {
    return process.env.BUILD || 'undefined'
  },
  CHAIN_ID() {
    const chainId = parseInt(process.env.CHAIN_ID)
    return isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId
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
