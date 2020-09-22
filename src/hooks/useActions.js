import { useCallback, useMemo } from 'react'
import { noop } from '@aragon/ui'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'

export function useActions() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { connectedAgreementApp, connectedDisputableVotingApp } = useOrgApps()

  const signAgreement = useCallback(
    async ({ versionId }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await connectedAgreementApp.sign(account, versionId)

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, connectedAgreementApp, mounted]
  )

  const challengeProposal = useCallback(
    async (
      { actionId, settlementOffer, finishedEvidence, context },
      onDone = noop
    ) => {
      catchErrors(async () => {
        const intent = await connectedAgreementApp.challenge(
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
    [account, connectedAgreementApp, mounted]
  )

  const settleDispute = useCallback(
    async ({ actionId }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await connectedAgreementApp.settle(actionId, account)

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, connectedAgreementApp, mounted]
  )

  const raiseDispute = useCallback(
    async ({ actionId, finishedEvidence }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await connectedAgreementApp.dispute(
          actionId,
          finishedEvidence,
          account
        )

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, connectedAgreementApp, mounted]
  )

  const voteOnProposal = useCallback(
    async ({ voteId, voteSupported }, onDone = noop) => {
      catchErrors(async () => {
        const intent = await connectedDisputableVotingApp.castVote(
          voteId,
          voteSupported,
          account
        )

        if (mounted()) {
          onDone(intent)
        }
      })
    },
    [account, connectedDisputableVotingApp, mounted]
  )

  const actions = useMemo(
    () => ({
      signAgreement,
      challengeProposal,
      settleDispute,
      voteOnProposal,
      raiseDispute,
    }),
    [
      signAgreement,
      challengeProposal,
      settleDispute,
      voteOnProposal,
      raiseDispute,
    ]
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
