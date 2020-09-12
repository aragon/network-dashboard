import { useEffect, useState } from 'react'
import { captureErrorWithSentry } from '../sentry'
import { useOrgApps } from '../providers/OrgApps'
import { useMounted } from '../hooks/useMounted'

export function useDisputableVotes() {
  const mounted = useMounted()
  const { disputableVotingApp, appsLoading } = useOrgApps()
  const [processedVotes, setProcessedVotes] = useState([])
  const [processedVotesLoading, setProcessedVotesLoading] = useState(true)

  useEffect(() => {
    async function getExtendedVote() {
      if (mounted()) {
        setProcessedVotesLoading(true)
      }

      try {
        const votes = await disputableVotingApp.votes()
        const processedVotes = votes
          ? votes.map((vote) => processVote(vote))
          : null

        if (mounted()) {
          setProcessedVotes(processedVotes)
          setProcessedVotesLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (mounted()) {
          setProcessedVotes(null)
          setProcessedVotesLoading(false)
        }
      }
    }

    if (!appsLoading && disputableVotingApp) {
      getExtendedVote()
    }
  }, [appsLoading, disputableVotingApp, mounted])

  return [processedVotes, processedVotesLoading]
}

export function useDisputableVote(proposalId) {
  const mounted = useMounted()
  const { apps, disputableVotingApp, appsLoading } = useOrgApps()
  const [processedVote, setProcessedVote] = useState(null)
  const [processedVoteLoading, setProcessedVoteLoading] = useState(true)

  useEffect(() => {
    async function getExtendedVote() {
      if (mounted()) {
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

    if (!appsLoading && disputableVotingApp) {
      getExtendedVote()
    }
  }, [apps, appsLoading, disputableVotingApp, proposalId, mounted])

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
