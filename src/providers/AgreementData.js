import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAgreementDetails } from '../hooks/useAgreementDetails'

const AgreementDataContext = React.createContext({
  agreementDetails: {},
  loading: true,
})

function AgreementDataProvider({ children }) {
  const [agreementDetails, { loading }] = useAgreementDetails()

  const AgreementDataState = useMemo(
    () => ({
      agreementDetails,
      loading,
    }),
    [agreementDetails, loading]
  )

  return (
    <AgreementDataContext.Provider value={AgreementDataState}>
      {children}
    </AgreementDataContext.Provider>
  )
}

AgreementDataProvider.propTypes = {
  children: PropTypes.node,
}

function useAgreementData() {
  return useContext(AgreementDataContext)
}

export { AgreementDataProvider, useAgreementData }
