import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import connectVoting from '@aragon/connect-disputable-voting'
import { useApps, createAppHook } from '@aragon/connect-react'
import { captureErrorWithSentry } from '../sentry'
import { connector } from '../current-environment'

const { agreement, disputableVoting } = connector

function getAppByName(apps, appName) {
  return apps.find(({ name }) => name === appName) || null
}

const OrgAppsContext = React.createContext({
  apps: null,
  agreementApp: null,
  disputableVotingApp: null,
  appsLoading: true,
})

const useAgreementHook = createAppHook(
  connectAgreement,
  agreement.connectorConfig
)

const useDisputableVotingHook = createAppHook(
  connectVoting,
  disputableVoting.connectorConfig
)

function OrgAppsProvider({ children }) {
  const [apps, { error: appsError, loading: orgAppsLoading }] = useApps()

  const [
    agreementApp,
    { error: agreementError, loading: agreementAppLoading },
  ] = useAgreementHook(getAppByName(apps, agreement.name))

  const [
    disputableVotingApp,
    { error: disputableVotingError, loading: disputableVotingAppLoading },
  ] = useDisputableVotingHook(getAppByName(apps, disputableVoting.name))

  const appsLoading =
    agreementAppLoading || disputableVotingAppLoading || orgAppsLoading

  const loadingError = appsError || agreementError || disputableVotingError

  if (loadingError) {
    captureErrorWithSentry(loadingError)
    console.error(loadingError)
  }

  const OrgAppState = useMemo(
    () => ({
      apps,
      agreementApp,
      disputableVotingApp,
      appsLoading,
    }),
    [apps, agreementApp, disputableVotingApp, appsLoading]
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
