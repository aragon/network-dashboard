import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import { captureErrorWithSentry } from '../sentry'
import { createAppHook, useApp } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'
import { useWallet } from '../providers/Wallet'

const AGREEMENT_SUBGRAPH_URL = networkEnvironment.subgraphs?.agreement

const agreementConnectorConfig = AGREEMENT_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: AGREEMENT_SUBGRAPH_URL },
]

const useAgreement = createAppHook(connectAgreement, agreementConnectorConfig)
const AgreementSubscriptionContext = React.createContext()

function AgreementSubscriptionProvider({ children }) {
  const { account } = useWallet()

  const [agreementApp, agreementAppStatus] = useApp('agreement')

  const [currentVersion, currentVersionStatus] = useAgreement(
    agreementApp,
    (app) => app.onCurrentVersion()
  )
  const [disputableApps, disputableAppsStatus] = useAgreement(
    agreementApp,
    (app) => app.onDisputableApps()
  )
  const [stakingFactory, stakingFactoryStatus] = useAgreement(
    agreementApp,
    (app) => app.stakingFactory()
  )
  const [signer, signerStatus] = useAgreement(
    agreementApp,
    (app) => (account ? app.onSigner(account) : null),
    [account]
  )

  // We must stringify the returned values for use as dependencies to avoid repeated re-renders on every poll
  const currentVersionDependency = JSON.stringify(currentVersion)
  const disputableAppsDependency = JSON.stringify(disputableApps)
  const signerDependency = JSON.stringify(signer)

  const loading =
    agreementAppStatus.loading ||
    currentVersionStatus.loading ||
    disputableAppsStatus.loading ||
    signerStatus.loading ||
    stakingFactoryStatus.loading

  const error =
    agreementAppStatus.error ||
    currentVersionStatus.error ||
    disputableAppsStatus.error ||
    signerStatus.error ||
    stakingFactoryStatus.error

  if (error) {
    captureErrorWithSentry(error)
    console.error(error)
  }

  // Only update the subscription state object when values have actually changed
  const AgreementSubscriptionState = useMemo(() => {
    return { currentVersion, stakingFactory, disputableApps, signer, loading }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    currentVersionDependency,
    disputableAppsDependency,
    stakingFactory,
    signerDependency,
    loading,
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <AgreementSubscriptionContext.Provider value={AgreementSubscriptionState}>
      {children}
    </AgreementSubscriptionContext.Provider>
  )
}

AgreementSubscriptionProvider.propTypes = {
  children: PropTypes.node,
}

function useAgreementSubscription() {
  return useContext(AgreementSubscriptionContext)
}

export { AgreementSubscriptionProvider, useAgreementSubscription }
