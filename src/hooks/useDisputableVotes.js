import { useEffect, useState } from 'react'
import { captureErrorWithSentry } from '../sentry'
import connectVoting from '@aragon/connect-disputable-voting'
import { useAppState } from '../providers/AppState'
import { networkEnvironment } from '../current-environment'

const SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const connecterConfig = SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: SUBGRAPH_URL },
]

export function useDisputableVotes() {
  const { disputableVotingApp, loading: appLoading } = useAppState()
  const [extendedVotes, setExtendedVotes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function getVotes() {
      if (!cancelled) {
        setLoading(true)
      }

      try {
        const voting = await connectVoting(disputableVotingApp, connecterConfig)
        const votes = await voting.votes()

        const processedVotes = votes.map((vote) => processVote(vote))

        if (!cancelled) {
          setExtendedVotes(processedVotes)
          setLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (!appLoading) {
      getVotes()
    }

    return () => {
      cancelled = true
    }
  }, [disputableVotingApp, appLoading])

  return [extendedVotes, loading]
}

export function useDisputableVote(proposalId) {
  const { apps, disputableVotingApp, loading: appLoading } = useAppState()
  const [loading, setLoading] = useState(true)
  const [extendedVote, setExtendedVote] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function getVote() {
      if (!cancelled) {
        setLoading(true)
      }

      try {
        const voting = await connectVoting(disputableVotingApp, connecterConfig)

        const vote = await voting.vote(
          `${disputableVotingApp.address}-vote-${proposalId}`
        )

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
          setLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (!appLoading) {
      getVote()
    }

    return () => {
      cancelled = true
    }
  }, [apps, appLoading, disputableVotingApp, proposalId])

  return [extendedVote, { loading }]
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
