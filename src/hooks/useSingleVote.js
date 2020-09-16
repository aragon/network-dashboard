import { useEffect, useState } from 'react'
import { networkEnvironment } from '../current-environment'
import { createAppHook, useApp } from '@aragon/connect-react'
import { formatTokenAmount } from '@aragon/ui'
import connectVoting from '@aragon/connect-disputable-voting'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'

const VOTING_SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const votingConnecterConfig = VOTING_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: VOTING_SUBGRAPH_URL },
]

const useDisputableVoting = createAppHook(connectVoting, votingConnecterConfig)

export function useSingleVote(proposalId) {
  const mounted = useMounted()
  const { account } = useWallet()
  const [votingApp, votingAppStatus] = useApp('disputable-voting')
  const [vote, votesStatus] = useDisputableVoting(
    votingApp,
    (app) => app.onVote(`${votingApp.address}-vote-${proposalId}`),
    [proposalId]
  )

  const [processedVote, setProcessedVote] = useState()
  const [processedVoteLoading, setProcessedVoteLoading] = useState(true)

  const loading = votingAppStatus.loading || votesStatus.loading
  const error = votingAppStatus.error || votesStatus.error

  if (error) {
    console.error(error)
  }

  // We must pass votes as value to avoid repeated re-renders on every poll
  const voteDependency = JSON.stringify(vote)

  const [castedVote] = useDisputableVoting(
    votingApp,
    () => vote.onCastVote(account),
    [account, voteDependency]
  )

  const castedVoteDependency = JSON.stringify(castedVote)

  useEffect(() => {
    console.log('testing casted vote', castedVote)
  }, [castedVoteDependency, mounted])

  useEffect(() => {
    if (mounted()) {
      setProcessedVoteLoading(true)
    }
  }, [proposalId, mounted])

  useEffect(() => {
    async function getExtendedVote() {
      console.log('process vote')
      const processedVote = await processVote(vote, account)

      if (mounted()) {
        setProcessedVote(processedVote)
        setProcessedVoteLoading(false)
      }
    }

    if (vote) {
      getExtendedVote()
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [voteDependency, castedVoteDependency, account, mounted])
  /* eslint-enable react-hooks/exhaustive-deps */

  return [processedVote, loading || processedVoteLoading]
}

async function processVote(vote, account) {
  const [
    collateral,
    settings,
    orgToken,
    submitterFee,
    challengerFee,
  ] = await Promise.all([
    vote.collateralRequirement(),
    vote.setting(),
    vote.token(),
    vote.submitterArbitratorFee(),
    vote.challengerArbitratorFee(),
  ])

  const collateralToken = await collateral.token()

  let voterInfo
  if (account) {
    const [
      balance,
      accountBalance,
      hasVoted,
      canExecute,
      canVote,
    ] = await Promise.all([
      orgToken.balance(account),
      vote.formattedVotingPower(account),
      vote.hasVoted(account),
      vote.canExecute(account),
      vote.canVote(account),
    ])

    voterInfo = {
      accountBalanceNow: formatTokenAmount(balance, orgToken.decimals),
      accountBalance: accountBalance,
      hasVoted: hasVoted,
      canExecute: canExecute,
      canVote: canVote,
    }
  }

  const processedVote = {
    ...processVoteAgain(vote),
    voterInfo: voterInfo,
    settings: settings,
    collateral: collateral,
    collateralToken: collateralToken,
    orgToken: orgToken,
    submitterFee: submitterFee,
    challengerFee: challengerFee,
  }

  return processedVote
}

function processVoteAgain(vote) {
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
    currentQuietEndingExtensionDuration:
      vote.currentQuietEndingExtensionDuration,
  }
}
