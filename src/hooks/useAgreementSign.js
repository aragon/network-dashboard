import { useEffect, useState, useCallback } from 'react'
import { captureErrorWithSentry } from '../sentry'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'

export function useAgreementSign() {
  const { apps, agreementApp } = useOrgApps()
  const [signed, setSignedStatus] = useState(null)
  const { account } = useWallet()

  const signAgreement = useCallback(() => agreementApp.sign(account), [
    agreementApp,
    account,
  ])

  useEffect(() => {
    let cancelled = false

    async function getSignedStatus() {
      try {
        const signer = await agreementApp.signer(account)

        if (!cancelled) {
          setSignedStatus(Boolean(signer))
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setSignedStatus(null)
        }
      }
    }

    if (account) {
      getSignedStatus()
    } else {
      if (!cancelled) {
        setSignedStatus(null)
      }
    }

    return () => {
      cancelled = true
    }
  }, [apps, agreementApp, account])

  return { sign: signAgreement, signed }
}
