import { useEffect, useState } from 'react'
import { describeScript } from '@aragon/connect'
import connectVoting from '@aragon/connect-disputable-voting'
import { useApps, createAppHook } from '@aragon/connect-react'
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
  const { disputableVotingApp } = useOrgApps()
  const apps = useApps()
  const [extendedVotesLoading, setLoading] = useState(true)
  const [processedVotes, setVotes] = useState(null)

  const [votes, { loading: votesLoading }] = useDisputableVotingHook(
    disputableVotingApp,
    (app) => {
      return app.votes()
    },

    []
  )
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    let cancelled = false
    async function getExtendedVotes() {
      if (!cancelled) {
        setLoading(true)
      }

      try {
        const processedVotes = await Promise.all(
          votes.map(async (vote) => processVote(vote, apps))
        )

        if (!cancelled) {
          setVotes(processedVotes)
          setLoading(false)
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
  }, [votes, votesLoading])
  /* eslint-disable react-hooks/exhaustive-deps */

  return [processedVotes, { loading: extendedVotesLoading }]
}

async function processVote(vote, apps) {
  const extendedVote = {
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
    return {
      ...vote,
      ...extendedVote,
    }
  }
  const description = await describeScript(vote.script, apps[0])
  return {
    ...vote,
    ...extendedVote,
    metadata: description,
  }
}

export function useDisputableVote(proposalId) {
  const { disputableVotingApp } = useOrgApps()
  const apps = useApps()
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
      if (!cancelled) {
        setExtendedVoteLoading(true)
      }

      try {
        const [collateral, settings, process] = await Promise.all([
          vote.collateralRequirement(),
          vote.setting(),
          processVote(vote, apps),
        ])

        const token = await collateral.token()

        const extendedVote = {
          ...process,
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
  }, [vote, voteLoading])
  /* eslint-disable react-hooks/exhaustive-deps */

  return [extendedVote, { loading: extendedVoteLoading }]
}
