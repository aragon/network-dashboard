import { DisputableStatusType } from '../types/disputable-statuses'
import { toMs } from '../utils/date-utils'
import { useMemo } from 'react'
import { useVotesSubscription } from '../providers/VotesSubscription'

export function useVotes() {
  const [votes, loading] = useVotesSubscription()

  const processedVotes = useMemo(() => {
    return votes ? votes.map((vote) => processVote(vote)) : []
  }, [votes])

  return [processedVotes, loading]
}

// Get and format values
function processVote(vote) {
  return {
    ...vote,
    disputableStatus: DisputableStatusType[vote.status],
    endDate: toMs(vote.endDate),
    hasEnded: vote.hasEnded,
  }
}
