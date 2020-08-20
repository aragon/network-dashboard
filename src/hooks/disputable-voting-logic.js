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
  const [extendedProperties, setExtendedProperties] = useState(null)
  const [disputableVoting] = useApp('disputable-voting')
  const [vote] = useDisputableVoting(disputableVoting, (app) => {
    return app.vote(voteId)
  })

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    async function getVoteSettings() {
      if (vote) {
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
      }
    }

    getVoteSettings()

    return () => {
      cancelled = true
    }
  }, [vote])

  if (vote === null) {
    return {
      voteLoading: true,
      vote: null,
    }
  }

  return {
    voteLoading: loading,
    vote: { ...vote, ...extendedProperties },
  }
}
