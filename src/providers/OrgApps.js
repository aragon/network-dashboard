import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import connectVoting from '@aragon/connect-disputable-voting'
import { useApps, createAppHook, useOrganization } from '@aragon/connect-react'
import { captureErrorWithSentry } from '../sentry'
import { connectorConfig } from '../current-environment'

function getAppByName(apps, appName) {
  return apps.find(({ name }) => name === appName) || null
}

const OrgAppsContext = React.createContext()

const useAgreementHook = createAppHook(
  connectAgreement,
  connectorConfig.agreement
)

const useDisputableVotingHook = createAppHook(
  connectVoting,
  connectorConfig.disputableVoting
)

function OrgAppsProvider({ children }) {
  const [apps, { loading: orgAppsLoading, error: appsError }] = useApps()
  const [org, { loading: orgLoading, error: orgError }] = useOrganization()

  const agreementApp = getAppByName(apps, 'agreement')
  const disputableVotingApp = getAppByName(apps, 'disputable-voting')

  const [
    connectedAgreementApp,
    { error: agreementError, loading: agreementAppLoading },
  ] = useAgreementHook(agreementApp)

  const [
    connectedDisputableVotingApp,
    { error: disputableVotingError, loading: disputableVotingLoading },
  ] = useDisputableVotingHook(disputableVotingApp)

  const appsLoading =
    agreementAppLoading ||
    disputableVotingLoading ||
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
      org,
      connectedAgreementApp,
      connectedDisputableVotingApp,
      agreementApp,
      disputableVotingApp,
      appsLoading,
    }),
    [
      apps,
      org,
      connectedAgreementApp,
      connectedDisputableVotingApp,
      agreementApp,
      disputableVotingApp,
      appsLoading,
    ]
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
