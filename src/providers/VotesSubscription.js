import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook, useApp } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'

const VOTING_SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const votingConnecterConfig = VOTING_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: VOTING_SUBGRAPH_URL },
]

const useDisputableVoting = createAppHook(connectVoting, votingConnecterConfig)

const VotesSubscriptionContext = React.createContext({
  votes: [],
  loading: true,
})

function VotesSubscriptionProvider({ children }) {
  const [votingApp, votingAppStatus] = useApp('disputable-voting')
  const [votes, votesStatus] = useDisputableVoting(votingApp, (app) =>
    app.onVotes()
  )

  const loading = votingAppStatus.loading || votesStatus.loading
  const error = votingAppStatus.error || votesStatus.error

  if (error) {
    console.error(error)
  }

  // We must pass votes as value to avoid repeated re-renders on every poll
  const votesDependency = JSON.stringify(votes)

  const VotesSubscriptionState = useMemo(() => {
    return { votes, loading }
  }, [votesDependency, loading])

  return (
    <VotesSubscriptionContext.Provider value={VotesSubscriptionState}>
      {children}
    </VotesSubscriptionContext.Provider>
  )
}

VotesSubscriptionProvider.propTypes = {
  children: PropTypes.node,
}

function useVotesSubscription() {
  return useContext(VotesSubscriptionContext)
}

export { VotesSubscriptionProvider, useVotesSubscription }
