import { useEffect, useState, useMemo } from 'react'
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

  const loading =
    votingAppStatus.loading || votesStatus.loading || processedVoteLoading
  const error = votingAppStatus.error || votesStatus.error

  if (error) {
    console.error(error)
  }

  // We must pass votes as value to avoid repeated re-renders on every poll
  const voteDependency = JSON.stringify(vote)

  const [castedVote] = useDisputableVoting(
    votingApp,
    () => (vote && account ? vote.onCastVote(account) : null),
    [account, voteDependency]
  )

  const castedVoteDependency = JSON.stringify(castedVote)

  useEffect(() => {
    if (mounted()) {
      setProcessedVoteLoading(true)
    }
  }, [proposalId, mounted])

  useEffect(() => {
    async function getExtendedVote() {
      try {
        const processedVote = await processVote(vote, account)

        if (mounted()) {
          setProcessedVote(processedVote)
          setProcessedVoteLoading(false)
        }
      } catch {
        setProcessedVoteLoading(false)
      }
    }

    if (vote) {
      getExtendedVote()
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [voteDependency, castedVoteDependency, account, mounted])
  /* eslint-enable react-hooks/exhaustive-deps */

  return [processedVote, loading]
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

  const voterInfo = account ? getVoterInfo(orgToken, vote, account) : null

  const processedVote = {
    ...vote,
    endDate: vote.endDate,
    hasEnded: vote.hasEnded,
    naysPct: vote.naysPct,
    yeasPct: vote.yeasPct,
    status: vote.status,
    currentQuietEndingExtensionDuration:
      vote.currentQuietEndingExtensionDuration,
    voterInfo: voterInfo,
    settings: settings,
    collateral: {
      ...collateral,
      token: collateralToken,
    },
    orgToken: orgToken,
    submitterFee: submitterFee,
    challengerFee: challengerFee,
  }

  return processedVote
}

async function getVoterInfo(vote, orgToken, account) {
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

  return {
    accountBalanceNow: formatTokenAmount(balance, orgToken.decimals),
    accountBalance: accountBalance,
    hasVoted: hasVoted,
    canExecute: canExecute,
    canVote: canVote,
  }
}
