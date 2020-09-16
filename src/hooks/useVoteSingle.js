import { useEffect, useState, useMemo } from 'react'
import { networkEnvironment } from '../current-environment'
import { createAppHook, useApp } from '@aragon/connect-react'
import { formatTokenAmount } from '@aragon/ui'
import connectVoting from '@aragon/connect-disputable-voting'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'
import { ProposalNotFound } from '../errors'

const VOTING_SUBGRAPH_URL = networkEnvironment.subgraphs?.disputableVoting

const votingConnecterConfig = VOTING_SUBGRAPH_URL && [
  'thegraph',
  { subgraphUrl: VOTING_SUBGRAPH_URL },
]

const useVoting = createAppHook(connectVoting, votingConnecterConfig)

function useVoteSubscription(proposalId) {
  const { account } = useWallet()
  const [votingApp] = useApp('disputable-voting')
  const [
    vote,
    { loading: voteLoading, error: voteError },
  ] = useVoting(
    votingApp,
    (app) => app.onVote(`${votingApp.address}-vote-${proposalId}`),
    [proposalId]
  )

  // This is a workaround for receiving the latest vote after an update.
  // Currently just listening for a vote change isn't enough to get all of the latest changes
  // so we use a subscription to castVote which correctly triggers on a full update
  // and use the return value as a dependency when passing down the vote.
  const [castVote, { error: castVoteError }] = useVoting(
    votingApp,
    () => (vote && account ? vote.onCastVote(account) : null),
    [account, JSON.stringify(vote)]
  )
  const castVoteDependency = JSON.stringify(castVote)

  /* eslint-disable react-hooks/exhaustive-deps */
  const updatedVote = useMemo(() => vote, [castVoteDependency])
  /* eslint-enable react-hooks/exhaustive-deps */

  const error = voteError || castVoteError

  if (error) {
    console.error(error)
  }

  return [updatedVote, { error: voteError, loading: voteLoading }]
}

export function useVoteSingle(proposalId) {
  const mounted = useMounted()
  const { account } = useWallet()
  const [vote, { loading, error }] = useVoteSubscription(proposalId)

  const [processedVote, setProcessedVote] = useState(null)
  const [processedVoteLoading, setProcessedVoteLoading] = useState(true)

  useEffect(() => {
    async function getExtendedVote() {
      try {
        const processedVote = await processVote(vote, account)

        if (mounted()) {
          setProcessedVote(processedVote)
          setProcessedVoteLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (mounted()) {
          setProcessedVoteLoading(false)
        }
      }
    }

    if (vote && !loading) {
      getExtendedVote()
    }
  }, [vote, account, mounted, loading])

  // Flip back to the loading state when updating proposalId via the address bar
  useEffect(() => {
    if (mounted()) {
      setProcessedVoteLoading(true)
    }
  }, [proposalId, mounted])

  // Throw to boundary if vote doesn't exist
  // TODO: This is super hacky because we can't tell the type of error that occurs
  // We can improve this as soon as we have typed errors from conncet
  useEffect(() => {
    if (!vote && !loading && error) {
      throw new ProposalNotFound(proposalId)
    }
  }, [vote, loading, proposalId, error])

  return [processedVote, processedVoteLoading]
}

async function processVote(vote, account) {
  const orgToken = await vote.token()

  const [settings, feeInfo, collateralInfo, voterInfo] = await Promise.all([
    vote.setting(),
    getFeeInfo(vote),
    getCollateralInfo(vote),
    account ? getVoterInfo(vote, orgToken, account) : {},
  ])

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
