import React from 'react'
import PropTypes from 'prop-types'
import {
  GU,
  IconAttention,
  IconCoin,
  Link,
  RADIUS,
  textStyle,
  useTheme,
  formatTokenAmount,
} from '@aragon/ui'
import { dateFormat, toMs } from '../../../utils/date-utils'

function FeedbackModule({ vote, mode }) {
  const theme = useTheme()
  const { collateral } = vote
  const pausedAt = toMs(vote.pausedAt)
  const settledAt = toMs(vote.settledAt)

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background: ${theme.background};
        padding: ${3.5 * GU}px ${10 * GU}px;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-template-columns: auto 1fr;
          grid-gap: ${3 * GU}px;
          align-items: center;
        `}
      >
        <div
          css={`
            color: ${mode === 'challenger' ? theme.warning : theme.info};
          `}
        >
          {mode === 'challenger' ? (
            <IconAttention size="large" />
          ) : (
            <IconCoin size="large" />
          )}
        </div>
        <div>
          <div
            css={`
                ${textStyle('body1')}
                margin-bottom: ${0.5 * GU}px;
              `}
          >
            {mode === 'challenger'
              ? 'You have challenged this vote'
              : 'You have accepted the settlement offer'}
          </div>
          <div
            css={`
                ${textStyle('body2')}
                color: ${theme.surfaceContentSecondary};
                `}
          >
            {mode === 'challenger' ? (
              <p>
                You challenged this action on{' '}
                <Strong>{dateFormat(pausedAt, 'standard')}</Strong> and locked{' '}
                <Strong>
                  {formatTokenAmount(
                    collateral.challengeAmount,
                    collateral.token.decimals
                  )}{' '}
                  {collateral.token.symbol}
                </Strong>{' '}
                as the action challenge collateral. You can manage your deposit
                balances in <Link href="">Stake Management</Link>.
              </p>
            ) : (
              <p>
                You accepted the settlement offer on{' '}
                <Strong>{dateFormat(settledAt, 'standard')}</Strong>
                and your action collateral has been slashed{' '}
                <Strong>
                  -
                  {formatTokenAmount(
                    collateral.actionAmount,
                    collateral.token.decimals
                  )}{' '}
                  {collateral.token.symbol}
                </Strong>
                . You can manage your deposit balances in{' '}
                <Link href="">Stake Management</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Strong({ children }) {
  const theme = useTheme()

  return (
    <strong
      css={`
        color: ${theme.surfaceContent};
      `}
    >
      {children}
    </strong>
  )
}

FeedbackModule.propTypes = {
  vote: PropTypes.object.isRequired,
  mode: PropTypes.string,
}

Strong.propTypes = {
  children: PropTypes.node,
}

export default FeedbackModule
