import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureErrorWithSentry } from '../sentry'
import { getIpfsCidFromUri, ipfsGet } from '../lib/ipfs-utils'
import { toMs } from '../utils/date-utils'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'

export function useAgreementDetails() {
  const { apps, agreementApp, appsLoading } = useOrgApps()
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
          agreementApp.currentVersion(),
          agreementApp.stakingFactory(),
          agreementApp.disputableApps(),
        ])

        const { content, effectiveFrom, title, versionId } = currentVersion
        const contentIpfsUri = ethersUtils.toUtf8String(content)

        const [extendedDisputableApps, agreementContent] = await Promise.all([
          processDisputableApps(apps, disputableApps),
          getAgreementContent(contentIpfsUri),
        ])

        const details = {
          contractAddress: agreementApp.address,
          content: agreementContent,
          contentIpfsUri: contentIpfsUri,
          disputableApps: extendedDisputableApps,
          effectiveFrom: toMs(effectiveFrom),
          stakingAddress: stakingFactory,
          sign: (accountAddress) =>
            agreementApp.sign(accountAddress, versionId),
          title: title,
        }

        if (!cancelled) {
          setAgreementDetails(details)
          setAgreementDetailsLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
      }
    }

    if (!appsLoading && agreementApp) {
      getAgreementDetails()
    }

    return () => {
      cancelled = true
    }
  }, [apps, agreementApp, appsLoading])

  return [agreementDetails, agreementDetailsLoading]
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
