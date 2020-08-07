import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'

function ConnectProvider({ children }) {
  const { legacyNetworkType, chainId, orgLocation } = networkEnvironment

  return (
    <Connect
      location={orgLocation}
      connector="thegraph"
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
