import React from 'react'
import PropTypes from 'prop-types'
import {
  GU,
  IconAttention,
  IconCheck,
  IconClock,
  IconClose,
  IconCross,
  IconInfo,
  Tag,
  textStyle,
  useTheme,
} from '@aragon/ui'
import IconDisputed from './IconDisputed'
import {
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_SCHEDULED,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_SETTLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_EXECUTED,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_REJECTED,
} from './disputable-vote-statuses'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_SCHEDULED]: {
      label: 'Scheduled',
      Icon: IconClock,
    },
    [VOTE_STATUS_ACCEPTED]: {
      background: theme.surface,
      label: 'Passed',
      Icon: IconCheck,
      color: theme.positive,
    },
    [VOTE_STATUS_CANCELLED]: {
      background: theme.surfaceUnder,
      label: 'Cancelled',
      Icon: IconClose,
      color: theme.disabledContent,
    },
    [VOTE_STATUS_SETTLED]: {
      background: theme.surfaceUnder,
      label: 'Settled',
      Icon: IconClose,
      color: theme.disabledContent,
    },
    [VOTE_STATUS_DISPUTED]: {
      background: '#FFEAEA',
      label: 'Disputed',
      Icon: IconDisputed,
      color: '#FF7C7C',
    },
    [VOTE_STATUS_EXECUTED]: {
      background: '#CADFAB',
      label: 'Passed (enacted)',
      Icon: IconInfo,
      color: '#749C47',
    },
    [VOTE_STATUS_CHALLENGED]: {
      background: theme.warningSurface,
      label: 'Challenged',
      Icon: IconAttention,
      color: theme.warningSurfaceContent,
    },
    [VOTE_STATUS_REJECTED]: {
      background: theme.surface,
      label: 'Rejected',
      Icon: IconCross,
      color: theme.negative,
    },
  }

  return attributes[status]
}

function DisputableStatusLabel({ status }) {
  const theme = useTheme()
  const { Icon, background, color, label } = getAttributes(status, theme)

  if (
    status === VOTE_STATUS_ACCEPTED ||
    status === VOTE_STATUS_EXECUTED ||
    status === VOTE_STATUS_REJECTED
  ) {
    return (
      <div
        css={`
          ${textStyle('body2')};
          color: ${color || theme.surfaceContentSecondary};
          display: flex;
          align-items: center;
        `}
      >
        <Icon size="small" />
        <span
          css={`
            margin-left: ${0.5 * GU}px;
            line-height: 1;
          `}
        >
          {label}
        </span>
      </div>
    )
  }

  return (
    <Tag
      background={background && `${background}`}
      color={color && `${color}`}
      mode="indicator"
      label={label}
      icon={<Icon size="small" />}
    />
  )
}

DisputableStatusLabel.propTypes = {
  status: PropTypes.oneOf([
    VOTE_STATUS_ACCEPTED,
    VOTE_STATUS_SCHEDULED,
    VOTE_STATUS_CANCELLED,
    VOTE_STATUS_SETTLED,
    VOTE_STATUS_DISPUTED,
    VOTE_STATUS_EXECUTED,
    VOTE_STATUS_CHALLENGED,
    VOTE_STATUS_REJECTED,
  ]),
}

export default DisputableStatusLabel
