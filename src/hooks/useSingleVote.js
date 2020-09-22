import { useMemo } from 'react'
import { useSingleVoteSubscription } from '../providers/SingleVoteSubscription'

export function useSingleVote() {
  const [voteInfo, loading] = useSingleVoteSubscription()

  const processedVote = useMemo(() => {
    return voteInfo && !loading ? processVote(voteInfo) : {}
  }, [voteInfo, loading])

  return [processedVote, loading]
}

// Get and format values
function processVote(voteInfo) {
  const { baseVote } = voteInfo

  return {
    ...baseVote,
    ...voteInfo,
    endDate: baseVote.endDate,
    hasEnded: baseVote.hasEnded,
    naysPct: baseVote.naysPct,
    yeasPct: baseVote.yeasPct,
    status: baseVote.status,
    currentQuietEndingExtensionDuration:
      baseVote.currentQuietEndingExtensionDuration,
  }
}
