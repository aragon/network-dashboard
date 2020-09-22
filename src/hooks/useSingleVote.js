import { useSingleVoteSubscription } from '../providers/SingleVoteSubscription'

export function useSingleVote() {
  const [vote, loading] = useSingleVoteSubscription()
  return [vote, loading]
}
