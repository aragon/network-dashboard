import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook, useApp } from '@aragon/connect-react'
import { connector } from '../current-environment'

const { disputableVoting } = connector

const useDisputableVoting = createAppHook(
  connectVoting,
  disputableVoting.connectorConfig
)
const VotesSubscriptionContext = React.createContext()

function VotesSubscriptionProvider({ children }) {
  const [votingApp, votingAppStatus] = useApp(disputableVoting.name)
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
    return [votes, { loading, error }]
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [votesDependency, loading])
  /* eslint-enable react-hooks/exhaustive-deps */

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
