import { useEffect, useState } from 'react'
import { captureErrorWithSentry } from '../sentry'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'
import { formatTokenAmount } from '@aragon/ui'

export function useDisputableVotes() {
  const { disputableVotingApp, appsLoading } = useOrgApps()
  const [processedVotes, setProcessedVotes] = useState([])
  const [processedVotesLoading, setProcessedVotesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
      if (!cancelled) {
        setProcessedVotesLoading(true)
      }

      try {
        const votes = await disputableVotingApp.votes()
        const processedVotes = votes
          ? votes.map((vote) => processVote(vote))
          : null

        if (!cancelled) {
          setProcessedVotes(processedVotes)
          setProcessedVotesLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setProcessedVotes(null)
          setProcessedVotesLoading(false)
        }
      }
    }

    if (!appsLoading && disputableVotingApp) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [appsLoading, disputableVotingApp])

  return [processedVotes, processedVotesLoading]
}

export function useDisputableVote(proposalId) {
  const { apps, disputableVotingApp, appsLoading } = useOrgApps()
  const { account } = useWallet()
  const [processedVote, setProcessedVote] = useState(null)
  const [processedVoteLoading, setProcessedVoteLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
      if (!cancelled) {
        setProcessedVoteLoading(true)
      }

      try {
        const vote = await disputableVotingApp.vote(
          `${disputableVotingApp.address}-vote-${proposalId}`
        )

        const [collateral, settings, orgToken] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
          vote.token(),
        ])

        const token = await collateral.token()

        let voterInfo
        if (account) {
          const balance = await token.balance(account)
          voterInfo = {
            accountBalanceNow: formatTokenAmount(balance, orgToken.decimals),
            accountBalance: await vote.formattedVotingPower(account),
            hasVoted: await vote.castVote(account),
            canExecute: await vote.canExecute(account),
            canVote: await vote.canVote(account),
          }
        }

        const processedVote = {
          ...processVote(vote),
          voterInfo: voterInfo,
          settings: settings,
          collateral: collateral,
          token: token,
          orgToken: orgToken,
        }

        if (!cancelled) {
          setProcessedVote(processedVote)
          setProcessedVoteLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setProcessedVote(null)
          setProcessedVoteLoading(false)
        }
      }
    }

    if (!appsLoading && disputableVotingApp) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [apps, appsLoading, disputableVotingApp, proposalId, account])

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
