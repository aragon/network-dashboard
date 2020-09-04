import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useOrganzation } from '../hooks/useOrganization'

const AppStateContext = React.createContext({
  apps: null,
  agreementApp: null,
  disputableVotingApp: null,
  appsLoading: true,
})

function getAppByName(apps, appName) {
  return apps ? apps.find(({ name }) => name === appName) : null
}

function AppStateProvider({ children }) {
  const { apps, organization, loading } = useOrganzation()

  const [agreementApp, disputableVotingApp] = useMemo(
    () => [
      getAppByName(apps, 'agreement'),
      getAppByName(apps, 'disputable-voting'),
    ],
    [apps]
  )

  const AppState = useMemo(
    () => ({
      apps,
      agreementApp,
      disputableVotingApp,
      loading,
      organization,
    }),
    [apps, agreementApp, disputableVotingApp, loading, organization]
  )

  return (
    <AppStateContext.Provider value={AppState}>
      {children}
    </AppStateContext.Provider>
  )
}

AppStateProvider.propTypes = {
  children: PropTypes.node,
}

function useAppState() {
  return useContext(AppStateContext)
}

export { AppStateProvider, useAppState }
