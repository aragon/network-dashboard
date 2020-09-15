import { useCallback, useMemo } from 'react'
import { noop } from '@aragon/ui'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'

export function useActions() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { agreementApp } = useOrgApps()

  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      try {
        const intent = await agreementApp.sign(account, versionId)

        if (mounted()) {
          onDone(intent)
        }
      } catch (err) {
        console.error(err)
      }
    },
    [account, agreementApp, mounted]
  )

  const challengeProposal = useCallback(
    async (
      { actionId, settlementOffer, finishedEvidence, context },
      onDone = noop
    ) => {
      try {
        const intent = await agreementApp.challenge(
          actionId,
          settlementOffer,
          finishedEvidence,
          context,
          account
        )

        if (mounted()) {
          onDone(intent)
        }
      } catch (err) {
        console.error(err)
      }
    },
    [account, agreementApp, mounted]
  )

  const settleDispute = useCallback(
    async ({ actionId }, onDone = noop) => {
      try {
        const intent = await agreementApp.settle(actionId, account)

        if (mounted()) {
          onDone(intent)
        }
      } catch (err) {
        console.error(err)
      }
    },
    [account, agreementApp, mounted]
  )

  const actions = useMemo(
    () => ({
      signAgreement,
      challengeProposal,
      settleDispute,
    }),
    [signAgreement, challengeProposal, settleDispute]
  )

  return actions
}
