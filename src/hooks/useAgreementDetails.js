import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureException } from '@sentry/browser'
import { createAppHook } from '@aragon/connect-react'
import connectAgreement from '@aragon/connect-agreement'
import {
  getIpfsUrlFromUri,
  getIpfsCidFromUri,
  ipfsGet,
} from '../lib/ipfs-utils'
import { networkEnvironment } from '../current-environment'
import { toMs } from '../lib/date-utils'
import { useOrgApps } from '../providers/OrgApps'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.agreement

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

const useAgreementHook = createAppHook(connectAgreement, connecterConfig)

export function useAgreementDetails() {
  const { apps, agreementApp } = useOrgApps()
  const [agreement, { loading: agreementAppLoading }] = useAgreementHook(
    agreementApp
  )
  const [agreementDetails, setAgreementDetails] = useState(null)
  const [agreementDetailsLoading, setAgreementDetailsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getAgreementDetails() {
      try {
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
          getExtendedDisputableApps(apps, disputableApps),
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
          setAgreementDetailsLoading(false)
        }
      } catch (err) {
        captureException(err)
        console.error(err)
      }
    }

    if (!agreementAppLoading) {
      getAgreementDetails()
    }

    return () => {
      cancelled = true
    }
  }, [apps, agreement, agreementAppLoading])

  return [agreementDetails, { loading: agreementDetailsLoading }]
}

function getAppPresentation(apps, appAddress) {
  const { contentUri, manifest } = apps.find(
    ({ address }) => address === appAddress
  )

  const iconPath = manifest.icons[0].src
  const iconSrc = getIpfsUrlFromUri(contentUri) + iconPath
  const humanName = manifest.name

  return { humanName, iconSrc }
}

async function getExtendedDisputableApps(apps, disputableApps) {
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
    console.error(error)

    return ''
  }

  return data
}
