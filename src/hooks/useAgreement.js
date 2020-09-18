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
  const [
    rawAgreement,
    { loading: rawAgreementLoading },
  ] = useAgreementSubscription()
  const [processedAgreement, setProcessedAgreement] = useState({})
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    async function processAgreementDetails() {
      try {
        const {
          currentVersion,
          appsWithRequirements,
          signer,
          stakingFactory,
        } = rawAgreement
        const { content, effectiveFrom, title, versionId } = currentVersion

        // TODO: Move this to the document component level
        const contentIpfsUri = ethersUtils.toUtf8String(content)
        const agreementContent = await getAgreementIpfsContent(contentIpfsUri)

        const disputableApps = processDisputableApps(apps, appsWithRequirements)

        if (mounted()) {
          setProcessedAgreement({
            contractAddress: agreementApp.address,
            content: agreementContent,
            contentIpfsUri: contentIpfsUri,
            disputableApps: disputableApps,
            effectiveFrom: toMs(effectiveFrom),
            stakingAddress: stakingFactory,
            signed: Boolean(signer),
            title: title,
            versionId: versionId,
          })
          setProcessing(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
      }
    }

    if (rawAgreement && !rawAgreementLoading) {
      processAgreementDetails()
    }
  }, [apps, rawAgreement, agreementApp, mounted, rawAgreementLoading])

  return [processedAgreement, processing]
}

function processDisputableApps(apps, disputableApps) {
  // Add presentation information for each disputable app
  const processedDisputableApps = disputableApps.map((disputableApp) => {
    const { address, challengeDuration } = disputableApp

    const { iconSrc, humanName } = getAppPresentation(apps, address)

    return {
      ...disputableApp,
      appName: humanName,
      iconSrc: iconSrc,
      challengeDuration: toMs(challengeDuration),
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
