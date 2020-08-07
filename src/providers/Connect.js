import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import { getOrgLocation } from '../networks'
import useChainId from '../hooks/useChainId'

function ConnectProvider({ children }) {
  const chainId = useChainId()
  const orgLocation = getOrgLocation(chainId)

  return (
    <Connect
      location={orgLocation}
      connector="thegraph"
      options={{ network: chainId }}
    >
      {children}
    </Connect>
  )
}

ConnectProvider.propTypes = {
  children: PropTypes.node,
}

export { ConnectProvider }
