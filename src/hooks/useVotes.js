import { useMemo } from 'react'
import { useVotesSubscription } from '../providers/VotesSubscription'

export function useVotes() {
  const { votes, loading } = useVotesSubscription()

  const processedVotes = useMemo(() => {
    return votes ? votes.map((vote) => processVote(vote)) : []
  }, [votes])

  return [processedVotes, loading]
}

function processVote(vote) {
  return {
    ...vote,
    endDate: vote.endDate,
    hasEnded: vote.hasEnded,
    naysPct: vote.naysPct,
    yeasPct: vote.yeasPct,
    status: vote.status,
    currentQuietEndingExtensionDuration:
      vote.currentQuietEndingExtensionDuration,
  }
}