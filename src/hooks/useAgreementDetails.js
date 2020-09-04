import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureErrorWithSentry } from '../sentry'
import connectAgreement from '@aragon/connect-agreement'
import { getIpfsCidFromUri, ipfsGet } from '../lib/ipfs-utils'
import { networkEnvironment } from '../current-environment'
import { toMs } from '../utils/date-utils'
import { useAppState } from '../providers/AppState'
import { getAppPresentation } from '../utils/app-utils'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.agreement

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

export function useAgreementDetails() {
  const { apps, agreementApp, loading: appLoading } = useAppState()
  const [agreementDetails, setAgreementDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getAgreementDetails() {
      try {
        const agreement = await connectAgreement(agreementApp, connecterConfig)

        const [
          currentVersion,
          stakingFactory,
          disputableApps,
        ] = await Promise.all([
          agreement.currentVersion(),
          agreement.stakingFactory(),
          agreement.disputableApps(),
        ])

        const { content, effectiveFrom, title } = currentVersion
        const contentIpfsUri = ethersUtils.toUtf8String(content)

        const [extendedDisputableApps, agreementContent] = await Promise.all([
          processDisputableApps(apps, disputableApps),
          getAgreementContent(contentIpfsUri),
        ])

        const details = {
          contractAddress: agreement.address,
          content: agreementContent,
          contentIpfsUri: contentIpfsUri,
          disputableApps: extendedDisputableApps,
          effectiveFrom: toMs(effectiveFrom),
          stakingAddress: stakingFactory,
          title: title,
        }

        if (!cancelled) {
          setAgreementDetails(details)
          setLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (!appLoading) {
      getAgreementDetails()
    }

    return () => {
      cancelled = true
    }
  }, [apps, agreementApp, appLoading])

  return [agreementDetails, loading]
}

async function processDisputableApps(apps, disputableApps) {
  const allRequirements = await Promise.all(
    disputableApps.map((app) => app.collateralRequirement())
  )

  const allTokens = await Promise.all(
    allRequirements.map((collateral) => collateral.token())
  )

  const extendedDisputableApps = disputableApps.map((disputableApp) => {
    const { iconSrc, humanName } = getAppPresentation(
      apps,
      disputableApp.address
    )

    const collateral = allRequirements.find(
      ({ id }) => id === disputableApp.collateralRequirementId
    )

    const token = allTokens.find(({ id }) => id === collateral.tokenId)

    return {
      appName: humanName,
      appAddress: disputableApp.address,
      challengeAmount: collateral.challengeAmount,
      actionAmount: collateral.actionAmount,
      iconSrc: iconSrc,
      token: token,
      challengeDuration: toMs(collateral.challengeDuration),
    }
  })

  return extendedDisputableApps
}

async function getAgreementContent(ipfsUri) {
  const { data, error } = await ipfsGet(getIpfsCidFromUri(ipfsUri))

  // TODO: Improve error handling, returning empty string to avoid render error
  if (error) {
    captureErrorWithSentry(error)
    console.error(error)

    return ''
  }

  return data
}
