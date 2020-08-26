import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAgreementDetails } from '../hooks/useAgreementDetails'
import { useDisputableVotes } from '../hooks/useDisputableVotes'

const AppDataContext = React.createContext({
  agreementDetails: null,
  disputableVotes: null,
  dataLoading: true,
})

function AppDataProvider({ children }) {
  const agreementDetails = useAgreementDetails()
  const disputableVotes = useDisputableVotes()

  const dataLoading = !agreementDetails || !disputableVotes

  const appDataState = useMemo(
    () => ({
      agreementDetails,
      disputableVotes,
      dataLoading,
    }),
    [agreementDetails, disputableVotes, dataLoading]
  )

  return (
    <AppDataContext.Provider value={appDataState}>
      {children}
    </AppDataContext.Provider>
  )
}

AppDataProvider.propTypes = {
  children: PropTypes.node,
}

function useAppData() {
  return useContext(AppDataContext)
}

export { AppDataProvider, useAppData }
