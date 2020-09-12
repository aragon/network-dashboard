import { useCallback } from 'react'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { useAgreementState } from '../providers/AgreementState'

export function useActions() {
  const { agreementApp } = useOrgApps()
  const { agreement } = useAgreementState()
  const { account } = useWallet()

  const { versionId } = agreement

  const signAgreement = useCallback(
    () => agreementApp.sign(account, versionId),
    [agreementApp, versionId, account]
  )

  return { signAgreement }
}
