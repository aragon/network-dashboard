import { useEffect, useState } from 'react'
import { useOrgApps } from '../providers/OrgApps'
import { createAppHook } from '@aragon/connect-react'
import connectAgreement from '@aragon/connect-agreement'
import { networkEnvironment } from '../current-environment'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.agreement

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

const useAgreementHook = createAppHook(connectAgreement, connecterConfig)

export function useAgreementDetails() {
  const { agreementApp } = useOrgApps()
  const [agreement, { loading: agreementAppLoading }] = useAgreementHook(
    agreementApp,
    (app) => app
  )
  const [agreementDetails, setAgreementDetails] = useState(null)
  const [agreementDetailsLoading, setAgreementDetailsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getAgreementDetails() {
      try {
        const [
          currentVersion,
          stakingAddress,
          disputableApps,
        ] = await Promise.all([
          agreement.currentVersion(),
          agreement.stakingFactory(),
          agreement.disputableApps(),
        ])

        const allCollateralRequirements = await Promise.all(
          disputableApps.map((app) => app.collateralRequirement())
        )

        const disputableAppsWithCollateral = disputableApps.map(
          (disputableApp) => {
            const collateralRequirements = allCollateralRequirements.find(
              ({ id }) => id === disputableApp.collateralRequirementId
            )

            return {
              ...disputableApp,
              collateralRequirements,
            }
          }
        )

        const { content, effectiveFrom, title } = currentVersion

        const details = {
          disputableApps: disputableAppsWithCollateral,
          contractAddress: agreement.address,
          content,
          effectiveFrom,
          stakingAddress,
          title,
        }

        if (!cancelled) {
          setAgreementDetails(details)
          setAgreementDetailsLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (!agreementAppLoading) {
      getAgreementDetails()
    }

    return () => {
      cancelled = true
    }
  }, [agreement, agreementAppLoading])

  return [agreementDetails, { loading: agreementDetailsLoading }]
}
