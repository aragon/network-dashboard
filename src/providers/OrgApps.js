import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useApp, useApps } from '@aragon/connect-react'

const OrgAppsContext = React.createContext({
  agreementApp: null,
  disputableVotingApp: null,
  installedApps: null,
  appsLoading: true,
})

function OrgAppsProvider({ children }) {
  const [agreementApp] = useApp('agreement')
  const [disputableVotingApp] = useApp('disputable-voting')
  const [installedApps] = useApps()

  const appsLoading = !agreementApp || !disputableVotingApp || !installedApps

  const OrgAppState = useMemo(
    () => ({
      agreementApp,
      disputableVotingApp,
      installedApps,
      appsLoading,
    }),
    [agreementApp, disputableVotingApp, installedApps, appsLoading]
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
