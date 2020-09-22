import { useMemo } from 'react'
import { useSingleVoteSubscription } from '../providers/SingleVoteSubscription'
import { toMs } from '../utils/date-utils'
import { DisputableStatusType } from '../types/disputable-statuses'

export function useSingleVote() {
  const [voteInfo, loading] = useSingleVoteSubscription()

  const processedVote = useMemo(() => {
    return voteInfo && !loading ? processVote(voteInfo) : {}
  }, [voteInfo, loading])

  return [processedVote, loading]
}

// Get and format values
function processVote(voteInfo) {
  const { baseVote, settings } = voteInfo

  return {
    ...baseVote,
    ...voteInfo,
    challengeEndDate: toMs(baseVote.challengeEndDate),
    disputableStatus: DisputableStatusType[baseVote.status],
    pausedAt: toMs(baseVote.pausedAt),
    settledAt: toMs(baseVote.settledAt),
    startDate: toMs(baseVote.startDate),
    endDate: toMs(baseVote.endDate),
    hasEnded: baseVote.hasEnded,
    naysPct: baseVote.naysPct,
    yeasPct: baseVote.yeasPct,
    extendedPeriod: toMs(baseVote.currentQuietEndingExtensionDuration),
    quietEndingPeriod: toMs(settings.quietEndingPeriod),
  }
}
