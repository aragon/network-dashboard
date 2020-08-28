import { useEffect, useState } from 'react'
import { describeScript } from '@aragon/connect'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook } from '@aragon/connect-react'
import { useOrgApps } from '../providers/OrgApps'
import { networkEnvironment } from '../current-environment'

const EMPTY_SCRIPT = '0x00000001'
const SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

const useDisputableVotingHook = createAppHook(connectVoting, connecterConfig)

export function useDisputableVotes() {
  const { apps, disputableVotingApp } = useOrgApps()
  const [extendedVotesLoading, setExtendedVotesLoading] = useState(true)
  const [extendedVotes, setExtendedVotes] = useState(null)

  const [votes, { loading: votesLoading }] = useDisputableVotingHook(
    disputableVotingApp,
    (app) => {
      return app.votes()
    }
  )

  useEffect(() => {
    let cancelled = false
    async function getExtendedVotes() {
      if (!cancelled) {
        setExtendedVotesLoading(true)
      }

      try {
        const processedVotes = await Promise.all(
          votes.map(async (vote) => processVote(vote, apps))
        )

        if (!cancelled) {
          setExtendedVotes(processedVotes)
          setExtendedVotesLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (!votesLoading) {
      getExtendedVotes()
    }

    return () => {
      cancelled = true
    }
  }, [apps, votes, votesLoading])

  return [extendedVotes, { loading: extendedVotesLoading }]
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
        const [collateral, settings, processedVote] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
          processVote(vote, apps),
        ])

        const token = await collateral.token()

        const extendedVote = {
          ...processedVote,
          settings: settings,
          collateral: collateral,
          token: token,
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
  }, [apps, vote, voteLoading])

  return [extendedVote, { loading: extendedVoteLoading }]
}

async function processVote(vote, apps) {
  const extendedVote = {
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

  if (vote.script === EMPTY_SCRIPT) {
    return extendedVote
  }

  const description = await describeScript(vote.script, apps)

  return {
    ...extendedVote,
    metadata: description,
  }
}
