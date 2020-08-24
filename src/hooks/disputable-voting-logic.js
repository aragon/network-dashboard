import { useState, useEffect } from 'react'
import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting-disputable'

const useDisputableVoting = createAppHook(connectVoting)

export function useVotes() {
  const [disputableVoting] = useApp('disputable-voting')
  const [votes] = useDisputableVoting(disputableVoting, (app) => app.votes())

  return votes
}

export function useGetVote(voteId) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [extendedProperties, setExtendedProperties] = useState(null)
  const [disputableVoting] = useApp('disputable-voting')

  const [vote, { voteLoading, voteError }] = useDisputableVoting(
    disputableVoting,
    (app) => {
      if (vote == null) {
        return app.vote(voteId)
      }
    }
  )

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    async function getVoteSettings() {
      if (!vote) {
        return
      }
      try {
        const collateral = await vote.collateralRequirement()
        const extendedProperties = {
          settings: await vote.setting(),
          collateral: collateral,
          token: await collateral.token(),
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
          setExtendedProperties(extendedProperties)
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
        setError(error)
      }
    }

    getVoteSettings()

    return () => {
      cancelled = true
    }
  }, [vote])

  useEffect(() => {
    setExtendedProperties(null)
  }, [voteId])

  if (vote === null) {
    return [null, { loading: voteLoading || vote === null, error: voteError }]
  }

  return [
    { ...vote, ...extendedProperties },
    { loading: loading, error: voteError || error },
  ]
}
