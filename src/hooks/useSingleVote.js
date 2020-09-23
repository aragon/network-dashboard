import { useMemo } from 'react'
import { useSingleVoteSubscription } from '../providers/SingleVoteSubscription'
import { durationToHours, toMs } from '../utils/date-utils'
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
  const {
    baseVote,
    collateral,
    fees,
    settings,
    voterInfo,
    votingToken,
  } = voteInfo

  const { challengeDuration } = collateral

  return {
    ...baseVote,
    collateral: {
      ...collateral,
      settlementPeriodHours: durationToHours(toMs(challengeDuration)),
    },
    challengeEndDate: toMs(baseVote.challengeEndDate),
    disputableStatus: DisputableStatusType[baseVote.status],
    endDate: toMs(baseVote.endDate),
    extendedPeriod: toMs(baseVote.currentQuietEndingExtensionDuration),
    fees: fees,
    hasEnded: baseVote.hasEnded,
    naysPct: baseVote.naysPct,
    pausedAt: toMs(baseVote.pausedAt),
    quietEndingPeriod: toMs(settings.quietEndingPeriod),
    settings: settings,
    settledAt: toMs(baseVote.settledAt),
    startDate: toMs(baseVote.startDate),
    voterInfo: voterInfo,
    votingToken: votingToken,
    yeasPct: baseVote.yeasPct,
  }
}
