import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  GU,
  IconCheck,
  IconConnect,
  IconCross,
  Info,
  noop,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_SCHEDULED,
} from '../disputable-vote-statuses'
import { dateFormat, toMs } from '../../../utils/date-utils'
import { useWallet } from '../../../providers/Wallet'

const VoteActions = React.memo(
  ({ vote, onVoteYes, onVoteNo, onExecute, onChangeVote }) => {
    const theme = useTheme()
    const { account } = useWallet()
    const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
    const { snapshotBlock, startDate, hasEnded, voterInfo, orgToken } = vote

    if (disputableStatus !== VOTE_STATUS_SCHEDULED) {
      return <></>
    }

    if (!account || !voterInfo) {
      return (
        <div
          css={`
            border-radius: ${RADIUS}px;
            background: ${theme.background};
            padding: ${3.5 * GU}px ${10 * GU}px;
            text-align: center;
          `}
        >
          <div
            css={`
              ${textStyle('body1')};
            `}
          >
            You must enable your account to vote on this proposal
          </div>
          <div
            css={`
              ${textStyle('body2')};
              color: ${theme.surfaceContentSecondary};
              margin-top: ${2 * GU}px;
            `}
          >
            Connect to your Ethereum provider by clicking on the{' '}
            <strong
              css={`
                display: inline-flex;
                align-items: center;
                position: relative;
                top: 7px;
              `}
            >
              <IconConnect /> Connect account
            </strong>{' '}
            button on the header. You may be temporarily redirected to a new
            screen.
          </div>
        </div>
      )
    }

    if (hasEnded) {
      return (
        <>
          {voterInfo.canExecute && (
            <>
              <Button mode="strong" onClick={onExecute} wide>
                Enact this vote
              </Button>
              <Info>
                The voting period is closed and the vote has passed.{' '}
                <strong>Anyone</strong> can now enact this vote to execute its
                action.
              </Info>
            </>
          )}
        </>
      )
    }

    if (
      !hasEnded &&
      voterInfo.hasVoted &&
      parseInt(voterInfo.accountBalance) > 0
    ) {
      return (
        <div>
          <Button
            mode="strong"
            onClick={onChangeVote}
            wide
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            Change my vote
          </Button>
          <Info>
            While the voting period is open, you can{' '}
            <strong>change your vote</strong> as many times as you wish.
          </Info>
        </div>
      )
    }

    if (voterInfo.canVote) {
      return (
        <>
          <Buttons onClickYes={onVoteYes} onClickNo={onVoteNo} />
          <TokenReference
            snapshotBlock={snapshotBlock}
            startDate={startDate}
            tokenSymbol={orgToken.symbol}
            accountBalance={voterInfo.accountBalance}
            accountBalanceNow={voterInfo.accountBalanceNow}
          />
        </>
      )
    }

    return (
      <div>
        <Buttons disabled />
        <Info mode="warning">
          {voterInfo.accountBalanceNow > 0
            ? 'Although the currently connected account holds tokens, it'
            : 'The currently connected account'}{' '}
          did not hold any <strong>{orgToken.symbol}</strong> tokens when this
          vote began ({dateFormat(toMs(startDate))}) and therefore cannot
          participate in this vote. Make sure your accounts are holding{' '}
          <strong>{orgToken.symbol}</strong> at the time a vote begins if you'd
          like to vote using this Voting app.
        </Info>
      </div>
    )
  }
)

/* eslint-disable react/prop-types */
const Buttons = ({ onClickYes = noop, onClickNo = noop, disabled = false }) => (
  <div
    css={`
      display: flex;
      margin-bottom: ${2 * GU}px;
    `}
  >
    <Button
      mode="positive"
      wide
      disabled={disabled}
      onClick={onClickYes}
      css={`
        ${textStyle('body2')};
        width: 50%;
        &:first-child {
          margin-right: ${1 * GU}px;
        }
      `}
    >
      <IconCheck
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      Yes
    </Button>
    <Button
      mode="negative"
      wide
      disabled={disabled}
      onClick={onClickNo}
      css={`
        ${textStyle('body2')};
        width: 50%;
        &:first-child {
          margin-right: ${1 * GU}px;
        }
      `}
    >
      <IconCross
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      No
    </Button>
  </div>
)

const TokenReference = ({
  snapshotBlock,
  startDate,
  tokenSymbol,
  accountBalance,
  accountBalanceNow,
}) => (
  <Info>
    Voting with{' '}
    <strong>
      {accountBalance} {tokenSymbol}
    </strong>{' '}
    . This was your balance when the vote started (block{' '}
    <strong>{snapshotBlock}</strong>, mined at{' '}
    <strong>{dateFormat(toMs(startDate))}</strong>).{' '}
    {accountBalance !== accountBalanceNow ? (
      <span>
        Your current balance is{' '}
        <strong>
          {accountBalanceNow} {tokenSymbol}
        </strong>
        )
      </span>
    ) : (
      ''
    )}
  </Info>
)

/* eslint-disable react/prop-types */

VoteActions.propTypes = {
  vote: PropTypes.object.isRequired,
  onVoteYes: PropTypes.func,
  onVoteNo: PropTypes.func,
  onExecute: PropTypes.func,
  onChangeVote: PropTypes.func,
}

export default VoteActions
