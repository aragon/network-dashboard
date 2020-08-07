import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import env from '../environment'
import { getNetworkEnvironment, orgLocation } from '../networks'

function ConnectProvider({ children }) {
  const { legacyNetworkType, chainId, ensAddress } = getNetworkEnvironment(
    env('NETWORK_ENVIRONMENT')
  )

  return (
    <Connect
      location={orgLocation}
      connector="thegraph"
      options={{
        name: legacyNetworkType,
        network: chainId,
        ensAddress,
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
