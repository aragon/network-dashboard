import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import connectVoting from '@aragon/connect-disputable-voting'
import { useApps, createAppHook, useOrganization } from '@aragon/connect-react'
import { captureErrorWithSentry } from '../sentry'
import { connector } from '../current-environment'

const { disputableVoting, agreement } = connector

function getAppByName(apps, appName) {
  return apps.find(({ name }) => name === appName) || null
}

const OrgAppsContext = React.createContext()

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
  const [org, { error: orgError, loading: orgLoading }] = useOrganization()

  const [
    agreementApp,
    { error: agreementError, loading: agreementAppLoading },
  ] = useAgreementHook(getAppByName(apps, agreement.name))

  const [
    disputableVotingApp,
    { error: disputableVotingError, loading: disputableVotingAppLoading },
  ] = useDisputableVotingHook(getAppByName(apps, disputableVoting.name))

  const appsLoading =
    agreementAppLoading ||
    disputableVotingAppLoading ||
    orgAppsLoading ||
    orgLoading

  const loadingError =
    appsError || agreementError || disputableVotingError || orgError

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
      org,
    }),
    [apps, agreementApp, disputableVotingApp, appsLoading, org]
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
