import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook } from '@aragon/connect-react'
import { captureErrorWithSentry } from '../sentry'
import { connectorConfig } from '../current-environment'
import { useOrgApps } from '../providers/OrgApps'

const useDisputableVoting = createAppHook(
  connectVoting,
  connectorConfig.disputableVoting
)
const VotesSubscriptionContext = React.createContext()

function VotesSubscriptionProvider({ children }) {
  const { disputableVotingApp } = useOrgApps()
  const [votes, { loading, error }] = useDisputableVoting(
    disputableVotingApp,
    (app) => app.onVotes()
  )
  if (error) {
    captureErrorWithSentry(error)
    console.error(error)
  }

  // We must pass votes as value to avoid repeated re-renders on every poll
  const votesDependency = JSON.stringify(votes)

  const VotesSubscriptionState = useMemo(() => {
    return [votes, loading]
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
