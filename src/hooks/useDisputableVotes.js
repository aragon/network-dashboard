import { useEffect, useState } from 'react'
import { captureException } from '@sentry/browser'
import { describeScript } from '@aragon/connect'
import connectVoting from '@aragon/connect-disputable-voting'
import { createAppHook } from '@aragon/connect-react'
import { useOrgApps } from '../providers/OrgApps'
import { networkEnvironment } from '../current-environment'
import { getAppPresentation } from '../lib/web3-utils'

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
          votes.map(async (vote) =>
            processVote(vote, apps, disputableVotingApp)
          )
        )

        if (!cancelled) {
          setExtendedVotes(processedVotes)
          setExtendedVotesLoading(false)
        }
      } catch (err) {
        captureException(err)
        console.error(err)
      }
    }

    if (!votesLoading) {
      getExtendedVotes()
    }

    return () => {
      cancelled = true
    }
  }, [apps, votes, votesLoading, disputableVotingApp])

  return [extendedVotes, extendedVotesLoading]
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
          processVote(vote, apps, disputableVotingApp),
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
      } catch (err) {
        captureException(err)
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

async function processVote(vote, apps, disputableVotingApp) {
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
    target: getTargetData(apps, disputableVotingApp.address),
  }

  // Return disputableVotingApp as the default app target
  if (vote.script === EMPTY_SCRIPT) {
    return extendedVote
  }

  const description = await describeScript(vote.script, apps)
  const voteHasAppTarget = description[0] && description[0].to

  // If we have the target app on the description, build the target data with it instead
  if (voteHasAppTarget) {
    extendedVote.target = {
      address: description[0].to,
      name: description[0].name || description[0].identifier,
    }
  }

  // If the target app is known to us then we can get it's icon and name
  if (isKnownApp(apps, extendedVote.target.address)) {
    extendedVote.target = getTargetData(apps, extendedVote.target.address)
  }

  return {
    ...extendedVote,
    description,
  }
}

function isKnownApp(apps, appAddress) {
  return apps && apps.filter((app) => app.address === appAddress).length > 0
}

function getTargetData(apps, address) {
  const presentation = getAppPresentation(apps, address)
  return {
    address: address,
    name: presentation.humanName,
    icon: presentation.iconSrc,
  }
}
