import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAgreement } from '../hooks/useAgreement'

const AgreementStateContext = React.createContext({
  agreement: {},
  loading: true,
})

function AgreementStateProvider({ children }) {
  const [agreement, loading] = useAgreement()

  const AgreementState = useMemo(
    () => ({
      agreement,
      loading,
    }),
    [agreement, loading]
  )

  return (
    <AgreementStateContext.Provider value={AgreementState}>
      {children}
    </AgreementStateContext.Provider>
  )
}

AgreementStateProvider.propTypes = {
  children: PropTypes.node,
}

function useAgreementState() {
  return useContext(AgreementStateContext)
}

export { AgreementStateProvider, useAgreementState }
