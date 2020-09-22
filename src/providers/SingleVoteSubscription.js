import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { createAppHook } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-disputable-voting'
import { formatTokenAmount } from '@aragon/ui'
import { captureErrorWithSentry } from '../sentry'
import { connectorConfig } from '../current-environment'
import { ProposalNotFound } from '../errors'
import { useWallet } from '../providers/Wallet'
import { useMounted } from '../hooks/useMounted'
import { useOrgApps } from '../providers/OrgApps'

const useDisputableVoting = createAppHook(
  connectVoting,
  connectorConfig.disputableVoting
)

const SingleVoteSubscriptionContext = React.createContext()

function SingleVoteSubscriptionProvider({ proposalId, children }) {
  const { account } = useWallet()
  const { disputableVotingApp } = useOrgApps()

  const [
    vote,
    { loading: voteLoading, error: voteError },
  ] = useDisputableVoting(
    disputableVotingApp,
    (app) => app.onVote(`${disputableVotingApp.address}-vote-${proposalId}`),
    [proposalId]
  )

  const voteUpdateValue = JSON.stringify(vote)

  // This is a workaround for receiving the latest vote after an update.
  // Currently just listening for a vote change isn't enough to get all of the latest changes
  // so we use a subscription to castVote which correctly triggers on a full update
  // and use the return value as a dependency when passing down the vote.
  const [
    castVote,
    { error: castVoteError },
  ] = useDisputableVoting(
    disputableVotingApp,
    () => (vote && account ? vote.onCastVote(account) : null),
    [account, voteUpdateValue]
  )

  // Use caseVote as a dependency value for storing the latest vote
  const castVoteUpdateValue = JSON.stringify(castVote)

  /* eslint-disable react-hooks/exhaustive-deps */
  const latestVote = useMemo(() => vote, [castVoteUpdateValue])
  /* eslint-enable react-hooks/exhaustive-deps */

  const [
    extendedVote,
    { loading: extendedVoteLoading, error: extendedVoteError },
  ] = useExtendVote(latestVote, proposalId)

  const error = voteError || castVoteError || extendedVoteError

  // Throw to boundary if vote doesn't exist
  // TODO: This is super hacky because we can't tell the type of error that occurs.
  // We can improve this as soon as we have typed errors from connect
  useEffect(() => {
    if (!vote && !voteLoading && voteError) {
      throw new ProposalNotFound(proposalId)
    }
  }, [vote, voteLoading, proposalId, voteError])

  if (error) {
    captureErrorWithSentry(error)
    console.error(error)
  }

  const SingleVoteSubscriptionState = useMemo(() => {
    return [extendedVote, extendedVoteLoading]
  }, [extendedVote, extendedVoteLoading])

  return (
    <SingleVoteSubscriptionContext.Provider value={SingleVoteSubscriptionState}>
      {children}
    </SingleVoteSubscriptionContext.Provider>
  )
}

SingleVoteSubscriptionProvider.propTypes = {
  proposalId: PropTypes.string,
  children: PropTypes.node,
}

function useExtendVote(vote, proposalId) {
  const mounted = useMounted()
  const { account } = useWallet()
  const [extendedVote, setExtendedVote] = useState({})
  const [status, setStatus] = useState({ loading: true, error: null })

  const getFeeInfo = useCallback(async () => {
    const [submitterFee, challengerFee] = await Promise.all([
      vote.submitterArbitratorFee(),
      vote.challengerArbitratorFee(),
    ])

    return {
      submitter: submitterFee,
      challenger: challengerFee,
    }
  }, [vote])

  const getCollateralInfo = useCallback(async () => {
    const collateral = await vote.collateralRequirement()
    const collateralToken = await collateral.token()

    return {
      ...collateral,
      token: collateralToken,
    }
  }, [vote])

  const getVoterInfo = useCallback(
    async (orgToken) => {
      if (!account) {
        return {}
      }

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
        account: account,
        accountBalanceNow: formatTokenAmount(balance, orgToken.decimals),
        accountBalance: accountBalance,
        hasVoted: hasVoted,
        canExecute: canExecute,
        canVote: canVote,
      }
    },
    [vote, account]
  )

  useEffect(() => {
    async function processAppRequirements() {
      try {
        const orgToken = await vote.token()

        const [
          settings,
          feeInfo,
          collateralInfo,
          voterInfo,
        ] = await Promise.all([
          vote.setting(),
          getFeeInfo(),
          getCollateralInfo(),
          getVoterInfo(orgToken),
        ])

        if (mounted()) {
          setExtendedVote({
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
          })
          setStatus({ loading: false, error: null })
        }
      } catch (err) {
        if (mounted()) {
          setStatus({ loading: false, error: err })
        }
      }
    }

    if (vote) {
      processAppRequirements()
    }
  }, [vote, getFeeInfo, getCollateralInfo, getVoterInfo, mounted])

  // Force loading state when updating route via the address bar
  useEffect(() => {
    if (mounted()) {
      setStatus({ loading: true, error: null })
    }
  }, [proposalId, mounted])

  return [extendedVote, status]
}

function useSingleVoteSubscription() {
  return useContext(SingleVoteSubscriptionContext)
}

export { SingleVoteSubscriptionProvider, useSingleVoteSubscription }
