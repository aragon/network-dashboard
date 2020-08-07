import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting-disputable'

const useDisputableVoting = createAppHook(connectVoting)

function useGetVotes() {
  const [disputableVoting] = useApp('disputable-voting')
  const [votes] = useDisputableVoting(disputableVoting, (app) => app.votes())

  return votes
}

// Handles the main logic of the disputable voting app.
export function useDisputableVotingLogic() {
  return {
    votes: useGetVotes(),
  }
}
