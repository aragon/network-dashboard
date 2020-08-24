import { useState, useEffect } from 'react'
import { createAppHook, useApp } from '@aragon/connect-react'
import connectAgreement from '@aragon/connect-agreement'
import { toMs } from '../lib/date-utils'
import { utils as ethersUtils } from 'ethers'

const useAgreementHook = createAppHook(connectAgreement)

export function useAgreementDetails() {
  const [agreementApp] = useApp('agreement')
  const [agreement] = useAgreementHook(agreementApp, (app) => app)
  const [agreementDetails, setAgreementDetails] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function getAgreementDetails() {
      try {
        const [currentVersion, stakingAddress] = await Promise.all([
          agreement.currentVersion(),
          agreement.stakingFactory(),
        ])

        const { content, effectiveFrom, title } = currentVersion

        const details = {
          contractAddress: agreementApp.address,
          contentUri: ethersUtils.toUtf8String(content),
          effectiveFrom: toMs(effectiveFrom),
          stakingAddress,
          title,
        }

        if (!cancelled) {
          setAgreementDetails(details)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (agreement && !agreementDetails) {
      getAgreementDetails()
    }

    return () => {
      cancelled = true
    }
  }, [agreement, agreementApp, agreementDetails])

  return agreementDetails
}
