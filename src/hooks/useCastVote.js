import { useEffect, useState, useMemo } from 'react'
import { captureErrorWithSentry } from '../sentry'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook } from '@aragon/connect-react'
import { networkEnvironment } from '../current-environment'
import { useOrgApps } from '../providers/OrgApps'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

const useDisputableVotingHook = createAppHook(connectVoting, connecterConfig)

export function useCastVoteInfo(proposalId, account) {
  const { apps, disputableVotingApp } = useOrgApps()
  const [extendedVoteLoading, setExtendedVoteLoading] = useState(true)
  const [extendedVote, setExtendedVote] = useState(null)

  const [vote, { loading: voteLoading }] = useDisputableVotingHook(
    disputableVotingApp,
    (app) => {
      return app.vote(`${disputableVotingApp.address}-vote-${proposalId}`)
    },

    // Refresh vote on id change
    [proposalId]
  )

  console.log(
    'd0',
    proposalId,
    account,
    `${disputableVotingApp.address}-vote-${proposalId}`,
    vote,
    voteLoading
  )

  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
      if (!cancelled) {
        setExtendedVoteLoading(true)
      }

      try {
        const extendedVote = await Promise.all(vote.castVote(account))
        console.log('d ext', extendedVote)
        if (!cancelled) {
          setExtendedVote(extendedVote)
          setExtendedVoteLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
        setExtendedVoteLoading(false)
      }
    }

    if (!voteLoading) {
      console.log('d ext1')
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [apps, vote, voteLoading, disputableVotingApp])

  return [extendedVote, { loading: extendedVoteLoading }]
}
