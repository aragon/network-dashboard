import React, { useContext, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import connectAgreement from '@aragon/connect-agreement'
import { captureErrorWithSentry } from '../sentry'
import { createAppHook, useApp } from '@aragon/connect-react'
import { connector } from '../current-environment'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'

const { agreement } = connector

const useAgreement = createAppHook(connectAgreement, agreement.connectorConfig)
const AgreementSubscriptionContext = React.createContext()

function AgreementSubscriptionProvider({ children }) {
  const { account } = useWallet()
  const [agreementApp, agreementAppStatus] = useApp(agreement.name)
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
  const [
    appsWithRequirements,
    { loading: appsWithRequirementsLoading, error: appsWithRequirementsError },
  ] = useAppsWithRequirements(disputableApps)

  // We must stringify the returned values for use as dependencies to avoid repeated re-renders on every poll
  const currentVersionDependency = JSON.stringify(currentVersion)
  const signerDependency = JSON.stringify(signer)

  const loading =
    agreementAppStatus.loading ||
    currentVersionStatus.loading ||
    disputableAppsStatus.loading ||
    signerStatus.loading ||
    stakingFactoryStatus.loading ||
    appsWithRequirementsLoading

  const error =
    agreementAppStatus.error ||
    currentVersionStatus.error ||
    disputableAppsStatus.error ||
    signerStatus.error ||
    stakingFactoryStatus.error ||
    appsWithRequirementsError

  if (error) {
    captureErrorWithSentry(error)
    console.error(error)
  }

  // Only update the subscription state object when values have actually changed
  const AgreementSubscriptionState = useMemo(() => {
    return [
      {
        currentVersion,
        stakingFactory,
        appsWithRequirements,
        signer,
      },
      { loading, error },
    ]
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    currentVersionDependency,
    appsWithRequirements,
    stakingFactory,
    signerDependency,
    loading,
    error,
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

function useAppsWithRequirements(disputableApps) {
  const mounted = useMounted()
  const [appsWithRequirements, setAppsWithRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // We must stringify the apps list to avoid repeated re-renders on every poll
  const disputableAppsDependency = JSON.stringify(disputableApps)

  useEffect(() => {
    async function applyAppRequirements() {
      if (mounted()) {
        setLoading(true)
      }

      try {
        // Concurrently request collateral and token requirements
        const allRequirements = await Promise.all(
          disputableApps.map((app) => app.collateralRequirement())
        )

        const allTokens = await Promise.all(
          allRequirements.map((collateral) => collateral.token())
        )

        // Add collateral requirements and app presentation information
        const appsWithRequirements = disputableApps.map((disputableApp) => {
          const collateral = allRequirements.find(
            ({ id }) => id === disputableApp.currentCollateralRequirementId
          )

          const token = allTokens.find(({ id }) => id === collateral.tokenId)

          return {
            appAddress: disputableApp.address,
            challengeAmount: collateral.challengeAmount,
            actionAmount: collateral.actionAmount,
            token: token,
            challengeDuration: collateral.challengeDuration,
          }
        })

        if (mounted()) {
          setAppsWithRequirements(appsWithRequirements)
          setLoading(false)
        }
      } catch (err) {
        if (mounted()) {
          setError(err)
          setLoading(false)
        }
      }
    }

    if (disputableApps) {
      applyAppRequirements()
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [disputableAppsDependency])
  /* eslint-enable react-hooks/exhaustive-deps */

  return [appsWithRequirements, { loading, error }]
}

function useAgreementSubscription() {
  return useContext(AgreementSubscriptionContext)
}

export { AgreementSubscriptionProvider, useAgreementSubscription }
