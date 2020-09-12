import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureErrorWithSentry } from '../sentry'
import { getIpfsCidFromUri, ipfsGet } from '../lib/ipfs-utils'
import { toMs } from '../utils/date-utils'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

export function useAgreement() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { apps, agreementApp, appsLoading } = useOrgApps()
  const [agreement, setAgreement] = useState(null)
  const [agreementLoading, setAgreementLoading] = useState(true)

  const canProcess = !appsLoading && agreementApp

  useEffect(() => {
    async function processAgreementDetails() {
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

        const [
          extendedDisputableApps,
          agreementContent,
          signer,
        ] = await Promise.all([
          processDisputableApps(apps, disputableApps),
          getAgreementIpfsContent(contentIpfsUri),
          account ? agreementApp.signer(account) : null,
        ])

        if (mounted()) {
          setAgreement({
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

    if (canProcess) {
      processAgreementDetails()
    }
  }, [apps, agreementApp, canProcess, mounted, account])

  return [agreement, agreementLoading]
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
