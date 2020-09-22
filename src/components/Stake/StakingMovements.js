import React from 'react'
import PropTypes from 'prop-types'
import {
  GU,
  IconAttention,
  IconCheck,
  IconClock,
  IconCross,
  IconLock,
  formatTokenAmount,
  Tag,
  useTheme,
  DataView,
} from '@aragon/ui'
import { dateFormat, toMs } from '../../utils/date-utils'
import InternalLink from '../InternalLink'

function StakingMovements({ stakingMovements, token }) {
  const theme = useTheme()

  return (
    <DataView
      fields={[
        { label: 'Date', priority: 1 },
        { label: 'Status', priority: 1 },
        { label: 'Action', priority: 3 },
        { label: 'Collateral state', priority: 1 },
        { label: 'Amount', priority: 1 },
      ]}
      entries={stakingMovements}
      renderEntry={({
        amount,
        createdAt,
        actionState,
        collateralState,
        tokenDecimals,
        disputableActionId,
      }) => {
        const actionAttributes = {
          Scheduled: {
            background: theme.infoSurface,
            color: theme.tagIndicatorContent,
            icon: <IconClock size="small" />,
          },
          Challenged: {
            background: theme.warningSurface,
            color: theme.warningSurfaceContent,
            icon: <IconAttention size="small" />,
          },
          Completed: {
            background: theme.positiveSurface,
            color: theme.positiveSurfaceContent,
            icon: <IconCheck size="small" />,
          },
          Cancelled: {
            background: theme.surfaceUnder,
            color: theme.contentSecondary,
            icon: <IconCross size="small" />,
          },
        }
        const amountAttributes = {
          Locked: {
            color: theme.surfaceOpened,
            icon: (
              <IconLock
                size="small"
                css={`
                  margin-right: ${1 * GU}px;
                `}
              />
            ),
          },
          Challenged: {
            color: theme.surfaceOpened,
            icon: (
              <IconLock
                size="small"
                css={`
                  margin-right: ${1 * GU}px;
                `}
              />
            ),
          },
          Available: {
            color: theme.content,
          },
          Slashed: {
            color: theme.negative,
          },
        }
        return [
          <time
            dateTime={dateFormat(toMs(createdAt), 'standard')}
            title={dateFormat(toMs(createdAt), 'standard')}
          >
            {dateFormat(toMs(createdAt), 'onlyDate')}
          </time>,
          <div>
            <Tag
              background={
                actionAttributes[actionState].background &&
                `${actionAttributes[actionState].background}`
              }
              color={
                actionAttributes[actionState].color &&
                `${actionAttributes[actionState].color}`
              }
              icon={actionAttributes[actionState].icon}
              mode="indicator"
              label={actionState}
            />
          </div>,
          <div>
            <InternalLink to={`/proposals/${disputableActionId}`}>
              Proposal #{disputableActionId}
            </InternalLink>
          </div>,
          <div>{collateralState}</div>,
          <span
            css={`
              font-weight: 600;
              color: ${amountAttributes[collateralState].color};
              display: flex;
              align-items: center;
            `}
          >
            {amountAttributes[collateralState].icon}
            {formatTokenAmount(amount, tokenDecimals, { symbol: token.symbol })}
          </span>,
        ]
      }}
    />
  )
}

StakingMovements.propTypes = {
  stakingMovements: PropTypes.array,
  token: PropTypes.object,
}

export default StakingMovements
