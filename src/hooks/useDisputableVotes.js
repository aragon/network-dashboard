import { useEffect, useState, useMemo } from 'react'
import { captureErrorWithSentry } from '../sentry'
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

  const [votes, { loading }] = useDisputableVotingHook(
    disputableVotingApp,
    (app) => {
      return app.votes()
    }
  )

  const processedVotes = useMemo(
    () => (votes ? votes.map((vote) => processVote(vote)) : null),
    [votes]
  )

  return [processedVotes, loading]
}

export function useDisputableVote(proposalId) {
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
          ...processVote(vote),
          settings: settings,
          collateral: collateral,
          token: token,
        }

        if (!cancelled) {
          setExtendedVote(extendedVote)
          setExtendedVoteLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
      }
    }

    if (!voteLoading) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [apps, vote, voteLoading, disputableVotingApp])

  return [extendedVote, { loading: extendedVoteLoading }]
}

function processVote(vote) {
  return {
    ...vote,
    endDate: vote.endDate,
    formattedNays: vote.formattedNays,
    formattedNaysPct: vote.formattedNaysPct,
    formattedTotalPower: vote.formattedTotalPower,
    formattedYeas: vote.formattedYeas,
    formattedYeasPct: vote.formattedYeasPct,
    hasEnded: vote.hasEnded,
    naysPct: vote.naysPct,
    yeasPct: vote.yeasPct,
    status: vote.status,
  }
}
