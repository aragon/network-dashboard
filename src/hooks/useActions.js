import { useCallback, useMemo } from 'react'
import { noop } from '@aragon/ui'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'

export function useActions() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { agreementApp, disputableVotingApp } = useOrgApps()

  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await agreementApp.sign(account, versionId)

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, agreementApp, mounted]
  )

  const challengeProposal = useCallback(
    async (
      { actionId, settlementOffer, finishedEvidence, context },
      onDone = noop
    ) => {
      catchErrors(async () => {
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
      })
    },
    [account, agreementApp, mounted]
  )

  const settleDispute = useCallback(
    async ({ actionId }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await agreementApp.settle(actionId, account)

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, agreementApp, mounted]
  )

  const voteOnProposal = useCallback(
    async ({ voteId, voteSupported }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await disputableVotingApp.castVote(
          voteId,
          voteSupported,
          account
        )

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, disputableVotingApp, mounted]
  )

  const actions = useMemo(
    () => ({
      signAgreement,
      challengeProposal,
      settleDispute,
      voteOnProposal,
    }),
    [signAgreement, challengeProposal, settleDispute, voteOnProposal]
  )

  return actions
}

async function catchErrors(cb) {
  try {
    await cb()
  } catch (err) {
    console.error(err)
  }
}
