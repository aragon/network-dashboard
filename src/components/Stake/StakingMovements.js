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
import InternalLink from '../InternalLink'
import {
  STAKING_SCHEDULED,
  STAKING_CHALLENGED,
  STAKING_COMPLETED,
  STAKING_CANCELLED,
  COLLATERAL_LOCKED,
  COLLATERAL_CHALLENGED,
  COLLATERAL_AVAILABLE,
  COLLATERAL_SLASHED,
  STAKING_STATUSES,
  COLLATERAL_STATUSES,
} from './staking-management-statuses'
import { dateFormat, toMs } from '../../utils/date-utils'

function getActionAttributes(status, theme) {
  const actionAttributes = {
    [STAKING_SCHEDULED]: {
      background: theme.infoSurface,
      color: theme.tagIndicatorContent,
      icon: <IconClock size="small" />,
    },
    [STAKING_CHALLENGED]: {
      background: theme.warningSurface,
      color: theme.warningSurfaceContent,
      icon: <IconAttention size="small" />,
    },
    [STAKING_COMPLETED]: {
      background: theme.positiveSurface,
      color: theme.positiveSurfaceContent,
      icon: <IconCheck size="small" />,
    },
    [STAKING_CANCELLED]: {
      background: theme.surfaceUnder,
      color: theme.contentSecondary,
      icon: <IconCross size="small" />,
    },
  }

  return actionAttributes[status]
}

function getCollateralAttributes(status, theme) {
  const collateralAttributes = {
    [COLLATERAL_LOCKED]: {
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
    [COLLATERAL_CHALLENGED]: {
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
    [COLLATERAL_AVAILABLE]: {
      color: theme.content,
    },
    [COLLATERAL_SLASHED]: {
      color: theme.negative,
    },
  }

  return collateralAttributes[status]
}

function StakingMovements({ stakingMovements, token }) {
  const theme = useTheme()

  return (
    <DataView
      fields={[
        { label: 'Date' },
        { label: 'Status' },
        { label: 'Action' },
        { label: 'Collateral state', align: 'end' },
        { label: 'Amount', align: 'end' },
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
        const stakingStatus = STAKING_STATUSES.get(actionState)
        const actionAttributes = getActionAttributes(stakingStatus, theme)

        const collateralStatus = COLLATERAL_STATUSES.get(collateralState)
        const amountAttributes = getCollateralAttributes(
          collateralStatus,
          theme
        )

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
                actionAttributes.background && `${actionAttributes.background}`
              }
              color={actionAttributes.color && `${actionAttributes.color}`}
              icon={actionAttributes.icon}
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
              color: ${amountAttributes.color};
              display: flex;
              align-items: center;
            `}
          >
            {amountAttributes.icon}
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
