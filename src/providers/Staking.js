import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useStaking } from '../hooks/useStaking'

const StakingContext = React.createContext({
  staking: {},
  loading: true,
})

function StakingProvider({ children }) {
  const [staking, loading] = useStaking()

  const Staking = useMemo(
    () => ({
      staking,
      loading,
    }),
    [staking, loading]
  )

  return (
    <StakingContext.Provider value={Staking}>
      {children}
    </StakingContext.Provider>
  )
}

StakingProvider.propTypes = {
  children: PropTypes.node,
}

function useStakingState() {
  return useContext(StakingContext)
}

export { StakingProvider, useStakingState }
