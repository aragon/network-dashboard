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
  const [disputableVoting] = useDisputableVotingHook(
    disputableVotingApp,
    (app) => app
  )
  const [disputableVotes, setDisputableVotes] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function getVotes() {
      try {
        const votes = await disputableVoting.votes()

        if (!cancelled) {
          setDisputableVotes(votes)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (disputableVoting && !disputableVotes) {
      getVotes()
    }

    return () => {
      cancelled = true
    }
  }, [disputableVotes, disputableVoting])

  return disputableVotes
}

export function useDisputableVote(proposalId) {
  const { disputableVotingApp } = useOrgApps()
  const [loading, setLoading] = useState(true)
  const [extendedVote, setExtendedVote] = useState(null)

  const [vote] = useDisputableVotingHook(disputableVotingApp, (app) => {
    return app.vote(`${disputableVotingApp.address}-vote-${proposalId}`)
  })

  useEffect(() => {
    let cancelled = false

    async function getExtendedVote() {
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
          formattedVotingPower: vote.formattedVotingPower,
          formattedYeas: vote.formattedYeas,
          formattedYeasPct: vote.formattedYeasPct,
          hasEnded: vote.hasEnded,
          naysPct: vote.naysPct,
          yeasPct: vote.yeasPct,
        }
        if (!cancelled) {
          setExtendedVote(extendedVote)
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (vote && !extendedVote) {
      getExtendedVote()
    }

    return () => {
      cancelled = true
    }
  }, [vote, extendedVote])

  return [extendedVote, { loading: loading }]
}
