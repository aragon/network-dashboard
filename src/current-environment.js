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

const agreementSubgraph = networkEnvironment.subgraphs?.agreement
const disputableVotingSubgraph = networkEnvironment.subgraphs?.disputableVoting
const orgSubgraph = networkEnvironment.subgraphs?.organization

export const connector = {
  org: {
    connectorConfig: orgSubgraph && [
      'thegraph',
      { orgSubgraphUrl: orgSubgraph },
    ],
  },
  agreement: {
    appName: 'agreement',
    connectorConfig: agreementSubgraph && [
      'thegraph',
      { subgraphUrl: agreementSubgraph },
    ],
  },
  disputableVoting: {
    appName: 'disputable-voting',
    connectorConfig: disputableVotingSubgraph && [
      'thegraph',
      { subgraphUrl: disputableVotingSubgraph },
    ],
  },
}
