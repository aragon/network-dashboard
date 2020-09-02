import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAgreementDetails } from '../hooks/useAgreementDetails'

const AgreementContext = React.createContext({
  agreementDetails: {},
  loading: true,
})

function AgreementProvider({ children }) {
  const [agreementDetails, loading] = useAgreementDetails()

  const AgreementState = useMemo(
    () => ({
      agreementDetails,
      loading,
    }),
    [agreementDetails, loading]
  )

  return (
    <AgreementContext.Provider value={AgreementState}>
      {children}
    </AgreementContext.Provider>
  )
}

AgreementProvider.propTypes = {
  children: PropTypes.node,
}

function useAgreement() {
  return useContext(AgreementContext)
}

export { AgreementProvider, useAgreement }
