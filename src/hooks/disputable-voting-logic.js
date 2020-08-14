import React, { useState, useEffect } from 'react'
import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting-disputable'

const useDisputableVoting = createAppHook(connectVoting)

function useGetVotes() {
  const [disputableVoting] = useApp('disputable-voting')
  const [votes] = useDisputableVoting(disputableVoting, (app) => app.votes())

  return votes
}

export function useGetVote(voteId) {
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [voteSettings, setVoteSettings] = useState(null)
  const [disputableVoting] = useApp('disputable-voting')
  const [vote] = useDisputableVoting(disputableVoting, (app) => {
    return app.vote(voteId)
  })

  useEffect(() => {
    let cancelled = false

    async function getVoteSettings() {
      setSettingsLoading(true)

      if (vote) {
        const currentVoteSettings = await vote.setting()
        if (!cancelled) {
          setVoteSettings(currentVoteSettings)
          setSettingsLoading(false)
        }
      }
    }

    getVoteSettings()

    return () => {
      cancelled = true
    }
  }, [vote])

  const voteLoading = vote === null

  return { settingsLoading, voteLoading, vote, voteSettings }
}

// Handles the main logic of the disputable voting app.
export function useDisputableVotingLogic() {
  return {
    votes: useGetVotes(),
  }
}
