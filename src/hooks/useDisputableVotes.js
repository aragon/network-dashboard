import { useEffect, useState } from 'react'
import { captureErrorWithSentry } from '../sentry'

import { useOrgApps } from '../providers/OrgApps'

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

    if (!appsLoading) {
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

        const [collateral, settings] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
        ])

        const token = await collateral.token()

        const processedVote = {
          ...processVote(vote),
          settings: settings,
          collateral: collateral,
          token: token,
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

    if (!appsLoading) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [apps, appsLoading, disputableVotingApp, proposalId])

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
