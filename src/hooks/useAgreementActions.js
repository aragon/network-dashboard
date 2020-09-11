import { useEffect, useState, useMemo } from 'react'
import { captureErrorWithSentry } from '../sentry'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'

export function useSignAgreement() {
  const { apps, agreementApp } = useOrgApps()
  const [signedStatus, setSignedStatus] = useState(null)
  const { account } = useWallet()

  const signAgreement = useMemo(() => {
    agreementApp.sign(account)
  }, [agreementApp, account])

  useEffect(() => {
    let cancelled = false

    async function getSignedStatus() {
      try {
        const signer = await agreementApp.signer(account)

        if (!cancelled) {
          setSignedStatus(signer)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
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

  return { sign: signAgreement, signedStatus }
}
