import { useEffect, useState } from 'react'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook } from '@aragon/connect-react'
import { useOrgApps } from '../providers/OrgApps'
import { networkEnvironment } from '../current-environment'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

const useDisputableVotingHook = createAppHook(connectVoting, connecterConfig)

export function useDisputableVotes() {
  const { disputableVotingApp } = useOrgApps()
  const [
    votes,
    { loading, error },
  ] = useDisputableVotingHook(disputableVotingApp, (app) => app.votes())

  if (error) {
    console.error(error)
  }

  return [votes, { loading }]
}

export function useDisputableVote(proposalId) {
  const { disputableVotingApp } = useOrgApps()
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

  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
      if (!cancelled) {
        setExtendedVoteLoading(true)
      }

      try {
        const [collateral, settings] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
        ])

        const token = await collateral.token()

        const extendedVote = {
          ...vote,
          settings: settings,
          collateral: collateral,
          token: token,
          status: vote.status,
          endDate: vote.endDate,
          formattedNays: vote.formattedNays,
          formattedNaysPct: vote.formattedNaysPct,
          formattedTotalPower: vote.formattedTotalPower,
          formattedYeas: vote.formattedYeas,
          formattedYeasPct: vote.formattedYeasPct,
          hasEnded: vote.hasEnded,
          naysPct: vote.naysPct,
          yeasPct: vote.yeasPct,
        }
        if (!cancelled) {
          setExtendedVote(extendedVote)
          setExtendedVoteLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (!voteLoading) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [vote, voteLoading])

  return [extendedVote, { loading: extendedVoteLoading }]
}
