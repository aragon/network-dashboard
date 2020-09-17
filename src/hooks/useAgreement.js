import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureErrorWithSentry } from '../sentry'
import { getIpfsCidFromUri, ipfsGet } from '../lib/ipfs-utils'
import { toMs } from '../utils/date-utils'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'
import { useMounted } from './useMounted'
import { useAgreementSubscription } from '../providers/AgreementSubscription'

export function useAgreement() {
  const mounted = useMounted()
  const { apps, agreementApp } = useOrgApps()
  const [processedAgreement, setProcessedAgreement] = useState({})
  const [agreementLoading, setAgreementLoading] = useState(true)
  const agreement = useAgreementSubscription()

  useEffect(() => {
    async function processAgreementDetails() {
      try {
        const {
          currentVersion,
          disputableApps,
          signer,
          stakingFactory,
        } = agreement
        const { content, effectiveFrom, title, versionId } = currentVersion

        const contentIpfsUri = ethersUtils.toUtf8String(content)

        const [extendedDisputableApps, agreementContent] = await Promise.all([
          processDisputableApps(apps, disputableApps),
          getAgreementIpfsContent(contentIpfsUri),
        ])

        if (mounted()) {
          setProcessedAgreement({
            contractAddress: agreementApp.address,
            content: agreementContent,
            contentIpfsUri: contentIpfsUri,
            disputableApps: extendedDisputableApps,
            effectiveFrom: toMs(effectiveFrom),
            stakingAddress: stakingFactory,
            signed: Boolean(signer),
            title: title,
            versionId: versionId,
          })
          setAgreementLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
      }
    }

    if (agreement && !agreement.loading) {
      processAgreementDetails()
    }
  }, [apps, agreementApp, mounted, agreement])

  return [processedAgreement, agreementLoading]
}

async function processDisputableApps(apps, disputableApps) {
  // Concurrently request collateral and token requirements
  const allRequirements = await Promise.all(
    disputableApps.map((app) => app.collateralRequirement())
  )

  const allTokens = await Promise.all(
    allRequirements.map((collateral) => collateral.token())
  )

  // Add collateral requirements and app presentation information
  const processedDisputableApps = disputableApps.map((disputableApp) => {
    const { iconSrc, humanName } = getAppPresentation(
      apps,
      disputableApp.address
    )

    const collateral = allRequirements.find(
      ({ id }) => id === disputableApp.currentCollateralRequirementId
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

  return processedDisputableApps
}

async function getAgreementIpfsContent(ipfsUri) {
  const { data, error } = await ipfsGet(getIpfsCidFromUri(ipfsUri))

  // TODO: Improve error handling, returning empty string to avoid render error
  if (error) {
    captureErrorWithSentry(error)
    console.error(error)

    return ''
  }

  return data
}
