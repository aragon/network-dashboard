import { useEffect, useState } from 'react'
import { captureErrorWithSentry } from '../sentry'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { formatTokenAmount } from '@aragon/ui'
import { useMounted } from '../hooks/useMounted'

export function useDisputableVote(proposalId) {
  const mounted = useMounted()
  const { apps, connectedDisputableVotingApp, appsLoading } = useOrgApps()
  const { account } = useWallet()
  const [processedVote, setProcessedVote] = useState(null)
  const [processedVoteLoading, setProcessedVoteLoading] = useState(true)

  useEffect(() => {
    async function getExtendedVote() {
      if (mounted()) {
        setProcessedVoteLoading(true)
      }

      try {
        const vote = await connectedDisputableVotingApp.vote(
          `${connectedDisputableVotingApp.address}-vote-${proposalId}`
        )

        const [
          collateral,
          settings,
          orgToken,
          submitterFee,
          challengerFee,
        ] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
          vote.token(),
          vote.submitterArbitratorFee(),
          vote.challengerArbitratorFee(),
        ])

        const collateralToken = await collateral.token()

        let voterInfo
        if (account) {
          const [
            balance,
            accountBalance,
            hasVoted,
            canExecute,
            canVote,
          ] = await Promise.all([
            orgToken.balance(account),
            vote.formattedVotingPower(account),
            vote.castVote(account),
            vote.canExecute(account),
            vote.canVote(account),
          ])

          voterInfo = {
            accountBalanceNow: formatTokenAmount(balance, orgToken.decimals),
            accountBalance: accountBalance,
            hasVoted: hasVoted,
            canExecute: canExecute,
            canVote: canVote,
          }
        }

        const processedVote = {
          ...processVote(vote),
          voterInfo: voterInfo,
          settings: settings,
          collateral: collateral,
          collateralToken: collateralToken,
          orgToken: orgToken,
          submitterFee: submitterFee,
          challengerFee: challengerFee,
        }

        if (mounted()) {
          setProcessedVote(processedVote)
          setProcessedVoteLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (mounted()) {
          setProcessedVote(null)
          setProcessedVoteLoading(false)
        }
      }
    }

    if (!appsLoading && connectedDisputableVotingApp) {
      getExtendedVote()
    }
  }, [
    apps,
    appsLoading,
    connectedDisputableVotingApp,
    proposalId,
    mounted,
    account,
  ])

  return [processedVote, processedVoteLoading]
}

function processVote(vote) {
  return {
    ...vote,
    endDate: vote.endDate,
    formattedNays: vote.formattedNays,
    formattedNaysPct: vote.formattedNaysPct,
    formattedTotalPower: vote.formattedTotalPower,
    formattedYeas: vote.formattedYeas,
    formattedYeasPct: vote.formattedYeasPct,
    hasEnded: vote.hasEnded,
    naysPct: vote.naysPct,
    yeasPct: vote.yeasPct,
    status: vote.status,
    currentQuietEndingExtensionDuration:
      vote.currentQuietEndingExtensionDuration,
  }
}
