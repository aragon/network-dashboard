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
    console.log('process vote')
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
  }, [voteDependency, castedVoteDependency, account])
  /* eslint-enable react-hooks/exhaustive-deps */

  return [processedVote, loading]
}

async function processVote(vote, account) {
  const [settings, orgToken, feeInfo, collateralInfo] = await Promise.all([
    vote.setting(),
    vote.token(),
    getFeeInfo(vote),
    getCollateralInfo(vote),
  ])

  const voterInfo = account ? await getVoterInfo(vote, orgToken, account) : {}

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
    collateral: collateralInfo,
    orgToken: orgToken,
    fees: feeInfo,
  }

  console.log(processedVote)

  return processedVote
}

async function getFeeInfo(vote) {
  const [submitterFee, challengerFee] = await Promise.all([
    vote.submitterArbitratorFee(),
    vote.challengerArbitratorFee(),
  ])

  return {
    submitter: submitterFee,
    challenger: challengerFee,
  }
}

async function getCollateralInfo(vote) {
  const collateral = await vote.collateralRequirement()
  const collateralToken = await collateral.token()

  return {
    ...collateral,
    token: collateralToken,
  }
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
