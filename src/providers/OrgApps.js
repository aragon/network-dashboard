import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useApps } from '@aragon/connect-react'

const OrgAppsContext = React.createContext({
  apps: null,
  agreementApp: null,
  disputableVotingApp: null,
  appsLoading: true,
})

function getAppByName(apps, appName) {
  return apps.find(({ name }) => name === appName) || null
}

function OrgAppsProvider({ children }) {
  const [apps, { loading }] = useApps()

  // Avoid additional overhead by finding within existing app list
  const agreementApp = getAppByName(apps, 'agreement')
  const disputableVotingApp = getAppByName(apps, 'disputable-voting')

  const OrgAppState = useMemo(
    () => ({
      apps,
      agreementApp,
      disputableVotingApp,
      appsLoading: loading,
    }),
    [apps, agreementApp, disputableVotingApp, loading]
  )

  return (
    <OrgAppsContext.Provider value={OrgAppState}>
      {children}
    </OrgAppsContext.Provider>
  )
}

OrgAppsProvider.propTypes = {
  children: PropTypes.node,
}

function useOrgApps() {
  return useContext(OrgAppsContext)
}

export { OrgAppsProvider, useOrgApps }
