import { useMemo } from 'react'
import { useVotesSubscription } from '../providers/VotesSubscription'

export function useVotes() {
  const { votes, loading } = useVotesSubscription()

  const processedVotes = useMemo(() => {
    return votes ? votes.map((vote) => processVote(vote)) : []
  }, [votes])

  return [processedVotes, loading]
}

// Placeholder for adding additional properties to votes
function processVote(vote) {
  return {
    ...vote,
  }
}
