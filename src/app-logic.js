import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting-disputable'

function useSelectedProposal() {
  const history = useHistory()

  // TODO: get data from selected proposal
  const selectedProposal = useMemo(() => {
    return 'Vote information'
  }, [])

  const selectProposal = useCallback(
    (proposalId) => {
      history.push(`/proposals/${proposalId}`)
    },
    [history]
  )
  return [selectedProposal, selectProposal]
}

function useGetVotes() {
  const useDisputableVoting = createAppHook(connectVoting)
  const [disputableVoting] = useApp('disputable-voting')
  const [votes] = useDisputableVoting(disputableVoting, (app) => app.votes())

  return votes
}

// Handles the main logic of the app.
export function useAppLogic() {
  const [selectedProposal, selectProposal] = useSelectedProposal()
  return {
    selectProposal,
    selectedProposal,
    getVotes: useGetVotes(),
  }
}
