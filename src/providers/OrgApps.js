import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import connectVoting from '@aragon/connect-disputable-voting'
import { useApps, createAppHook } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'

const AGREEMENT_SUBGRAPH_URL = networkEnvironment.subgraphs?.agreement
const VOTING_SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const agreementConnectorConfig = AGREEMENT_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: AGREEMENT_SUBGRAPH_URL },
]

const votingConnecterConfig = VOTING_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: VOTING_SUBGRAPH_URL },
]

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
  agreementConnectorConfig
)

const useDisputableVotingHook = createAppHook(
  connectVoting,
  votingConnecterConfig
)

function OrgAppsProvider({ children }) {
  const [apps, { loading: orgLoading }] = useApps()

  const [agreementApp, { loading: agreementAppLoading }] = useAgreementHook(
    getAppByName(apps, 'agreement')
  )

  const [
    disputableVotingApp,
    { loading: disputableVotingAppLoading },
  ] = useDisputableVotingHook(getAppByName(apps, 'disputable-voting'))

  const OrgAppState = useMemo(
    () => ({
      apps,
      agreementApp,
      disputableVotingApp,
      appsLoading:
        agreementAppLoading || disputableVotingAppLoading || orgLoading,
    }),
    [
      apps,
      agreementApp,
      agreementAppLoading,
      disputableVotingApp,
      disputableVotingAppLoading,
      orgLoading,
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
