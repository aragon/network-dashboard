import { useState, useEffect } from 'react'
import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting-disputable'

const useDisputableVoting = createAppHook(connectVoting)

function useGetVotes() {
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

    async function getVoteSettings() {
      setLoading(true)

      if (vote) {
        const collateral = await vote.collateralRequirement()

        const extendedProperties = {
          settings: await vote.setting(),
          status: await vote.status(),
          collateral: collateral,
          token: await collateral.token(),
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

  return {
    voteLoading: vote === null || loading,
    vote: { ...vote, ...extendedProperties },
  }
}

// Handles the main logic of the disputable voting app.
export function useDisputableVotingLogic() {
  return {
    votes: useGetVotes(),
  }
}
