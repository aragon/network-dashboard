import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'

const ORG_SUBGRAPH_URL = networkEnvironment.subgraphs?.organization

const connecterConfig = ORG_SUBGRAPH_URL && [
  'thegraph',
  { orgSubgraphUrl: ORG_SUBGRAPH_URL },
]

function ConnectProvider({ children }) {
  const { legacyNetworkType, chainId, orgLocation } = networkEnvironment

  return (
    <Connect
      location={orgLocation}
      connector={connecterConfig || 'thegraph'}
      options={{
        name: legacyNetworkType,
        network: chainId,
      }}
    >
      {children}
    </Connect>
  )
}

ConnectProvider.propTypes = {
  children: PropTypes.node,
}

export { ConnectProvider }
