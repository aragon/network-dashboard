import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { addressesEqual } from '../lib/web3-utils'
import { toMs, durationToHours } from '../utils/date-utils'
import { getAppPresentation } from '../utils/app-utils'
import { round } from '../lib/math-utils'
import { useOrgApps } from '../providers/OrgApps'
import { useMounted } from './useMounted'
import { useAgreementSubscription } from '../providers/AgreementSubscription'

export function useAgreement() {
  const mounted = useMounted()
  const { apps, agreementApp } = useOrgApps()
  const [agreement, { loading: agreementLoading }] = useAgreementSubscription()
  const [processedAgreement, setProcessedAgreement] = useState({})
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    function processAgreementDetails() {
      const {
        currentVersion,
        appsWithRequirements,
        signer,
        stakingFactory,
      } = agreement
      const { content, effectiveFrom, title, versionId } = currentVersion

      const disputableAppsWithRequirements = processDisputableApps(
        apps,
        appsWithRequirements
      )

      if (mounted()) {
        setProcessedAgreement({
          contractAddress: agreementApp.address,
          contentIpfsUri: ethersUtils.toUtf8String(content),
          disputableAppsWithRequirements: disputableAppsWithRequirements,
          effectiveFrom: toMs(effectiveFrom),
          stakingAddress: stakingFactory,
          signed: Boolean(signer),
          title: title,
          versionId: versionId,
        })
        setProcessing(false)
      }
    }

    if (!agreementLoading) {
      processAgreementDetails()
    }
  }, [apps, agreement, agreementApp, mounted, agreementLoading])

  return [processedAgreement, processing]
}

function processDisputableApps(apps, disputableApps) {
  // Add presentation information and value formatting for each app
  const processedDisputableApps = disputableApps.map((disputableApp) => {
    const {
      address: disputableAppAddress,
      challengeDuration,
      actionAmount,
      challengeAmount,
      token,
    } = disputableApp

    const targetApp = apps.find(({ address }) =>
      addressesEqual(address, disputableAppAddress)
    )

    const { iconSrc, humanName } = getAppPresentation(targetApp)

    return {
      address: disputableAppAddress,
      appName: humanName,
      actionAmount: actionAmount,
      challengeAmount: challengeAmount,
      settlementPeriodHours: round(durationToHours(toMs(challengeDuration))),
      iconSrc: iconSrc,
      token: token,
    }
  })

  return processedDisputableApps
}
