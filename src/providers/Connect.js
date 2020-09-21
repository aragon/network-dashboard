import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import { connectorConfig, networkEnvironment } from '../current-environment'

function ConnectProvider({ children }) {
  const { chainId, orgLocation } = networkEnvironment

  return (
    <Connect
      location={orgLocation}
      connector={connectorConfig.org || 'thegraph'}
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
