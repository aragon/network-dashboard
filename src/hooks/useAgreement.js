import { useMemo } from 'react'
import { utils as ethersUtils } from 'ethers'
import { addressesEqual } from '../lib/web3-utils'
import { toMs } from '../utils/date-utils'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'
import { useAgreementSubscription } from '../providers/AgreementSubscription'

export function useAgreement() {
  const { apps, agreementApp } = useOrgApps()
  const [agreement, { loading: agreementLoading }] = useAgreementSubscription()

  const processedAgreement = useMemo(() => {
    return agreement && !agreementLoading
      ? processAgreement(agreement, apps, agreementApp)
      : {}
  }, [agreement, apps, agreementApp, agreementLoading])

  return [processedAgreement, agreementLoading]
}

function processAgreement(agreement, apps, agreementApp) {
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

  return {
    contractAddress: agreementApp.address,
    contentIpfsUri: ethersUtils.toUtf8String(content),
    disputableApps: disputableAppsWithRequirements,
    effectiveFrom: toMs(effectiveFrom),
    stakingAddress: stakingFactory,
    signed: Boolean(signer),
    title: title,
    versionId: versionId,
  }
}

function processDisputableApps(apps, disputableApps) {
  // Add presentation information and value formatting for each app
  const processedDisputableApps = disputableApps.map((disputableApp) => {
    const { address: disputableAppAddress, challengeDuration } = disputableApp

    const app = apps.find(({ address }) =>
      addressesEqual(address, disputableAppAddress)
    )

    const { iconSrc, humanName } = getAppPresentation(app)

    return {
      ...disputableApp,
      appName: humanName,
      iconSrc: iconSrc,
      challengeDuration: toMs(challengeDuration),
    }
  })

  return processedDisputableApps
}
