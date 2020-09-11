import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  blockExplorerUrl,
  Button,
  GU,
  IconCheck,
  IconConnect,
  IconCross,
  Info,
  Link,
  noop,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { dateFormat, toMs } from '../../../utils/date-utils'

import { useWallet } from '../../../providers/Wallet'

export const VOTE_YEA = 'VOTE_YEA'
export const VOTE_NAY = 'VOTE_NAY'
const EMPTY_SCRIPT = '0x00000001'

const VoteActions = React.memo(({ vote, onVoteYes, onVoteNo, onExecute }) => {
  const [ready, setReady] = useState(false)
  const [changeVote, setChangeVote] = useState(false)
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const handleChangeVote = useCallback(() => setChangeVote(true), [])
  const { snapshotBlock, startDate, hasEnded } = vote

  // TODO: get real info for all this variables
  const tokenSymbol = 'ANT'
  const canUserVote = !vote.hasEnded
  const canExecute = connectedAccount ? true : false
  const userBalance = connectedAccount ? 1 : -1
  const userBalanceNow = connectedAccount ? 2 : -1
  const { connectedAccountVote } = vote
  const hasVoted = false

  if (hasEnded) {
    return (
      <React.Fragment>
        {canExecute && vote.script !== EMPTY_SCRIPT && (
          <React.Fragment>
            <Button mode="strong" onClick={onExecute} wide>
              Enact this vote
            </Button>
            <Info>
              The voting period is closed and the vote has passed.{' '}
              <strong>Anyone</strong> can now enact this vote to execute its
              action.
            </Info>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  if (canUserVote && hasVoted && !changeVote) {
    return (
      <div>
        <Button
          mode="strong"
          onClick={handleChangeVote}
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

  if (canUserVote) {
    return (
      <div>
        {connectedAccount ? (
          <React.Fragment>
            <Buttons onClickYes={onVoteYes} onClickNo={onVoteNo} />
            <TokenReference
              snapshotBlock={snapshotBlock}
              startDate={startDate}
              tokenSymbol={tokenSymbol}
              userBalance={userBalance}
              userBalanceNow={userBalanceNow}
            />
          </React.Fragment>
        ) : (
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
                <IconConnect /> Enable account
              </strong>{' '}
              button on the header. You may be temporarily redirected to a new
              screen.
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <Buttons disabled />
      <Info mode="warning">
        {userBalanceNow > 0
          ? 'Although the currently connected account holds tokens, it'
          : 'The currently connected account'}{' '}
        did not hold any <strong>{tokenSymbol}</strong> tokens when this vote
        began ({dateFormat(toMs(startDate))}) and therefore cannot participate
        in this vote. Make sure your accounts are holding{' '}
        <strong>{tokenSymbol}</strong> at the time a vote begins if you'd like
        to vote using this Voting app.
      </Info>
    </div>
  )
})

const Buttons = ({ onClickYes = noop, onClickNo = noop, disabled = false }) => (
  <ButtonsContainer>
    <VotingButton mode="positive" wide disabled={disabled} onClick={onClickYes}>
      <IconCheck
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      Yes
    </VotingButton>
    <VotingButton mode="negative" wide disabled={disabled} onClick={onClickNo}>
      <IconCross
        size="small"
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      No
    </VotingButton>
  </ButtonsContainer>
)

const ButtonsContainer = styled.div`
  display: flex;
  margin-bottom: ${2 * GU}px;
`

const TokenReference = ({
  snapshotBlock,
  startDate,
  tokenSymbol,
  userBalance,
  userBalanceNow,
}) => (
  <Info>
    Voting with{' '}
    <strong>
      {userBalance} {tokenSymbol}
    </strong>{' '}
    . This was your balance when the vote started (block{' '}
    <strong>{snapshotBlock}</strong>, mined at{' '}
    <strong>{dateFormat(toMs(startDate))}</strong>).{' '}
    {userBalance !== userBalanceNow ? (
      <span>
        Your current balance is{' '}
        <strong>
          {userBalanceNow} {tokenSymbol}
        </strong>
        )
      </span>
    ) : (
      ''
    )}
  </Info>
)

const VotingButton = styled(Button)`
  ${textStyle('body2')};
  width: 50%;
  &:first-child {
    margin-right: ${1 * GU}px;
  }
`

export default VoteActions
