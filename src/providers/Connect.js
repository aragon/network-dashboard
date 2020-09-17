import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import { connector, networkEnvironment } from '../current-environment'

const { org } = connector

function ConnectProvider({ children }) {
  const { chainId, orgLocation } = networkEnvironment

  return (
    <Connect
      location={orgLocation}
      connector={org.connectorConfig || 'thegraph'}
      options={{
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
