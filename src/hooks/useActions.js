import { useCallback } from 'react'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'

export function useActions() {
  const { agreementApp } = useOrgApps()
  const { account } = useWallet()

  const signAgreement = useCallback(() => agreementApp.sign(account), [
    agreementApp,
    account,
  ])

  return { signAgreement }
}
