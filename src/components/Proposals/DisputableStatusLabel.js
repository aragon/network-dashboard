import React from 'react'
import PropTypes from 'prop-types'
import {
  IconAttention,
  IconCheck,
  IconClock,
  IconClose,
  IconCross,
  IconInfo,
  IconWarning,
  Tag,
  useTheme,
} from '@aragon/ui'
import {
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_ACTIVE,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_EXECUTED,
  VOTE_STATUS_PAUSED,
  VOTE_STATUS_REJECTED,
} from './disputable-vote-statuses'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_ACTIVE]: {
      label: 'Scheduled',
      Icon: IconClock,
    },
    [VOTE_STATUS_ACCEPTED]: {
      background: theme.surface,
      label: 'Accepted',
      Icon: IconCheck,
      color: theme.positive,
    },
    [VOTE_STATUS_CANCELLED]: {
      background: theme.surfaceUnder,
      label: 'Cancelled',
      Icon: IconClose,
      color: theme.disabledContent,
    },
    [VOTE_STATUS_DISPUTED]: {
      background: '#FCC2AA',
      label: 'Disputed',
      Icon: IconWarning,
      color: '#D26C41',
    },
    [VOTE_STATUS_EXECUTED]: {
      background: '#CADFAB',
      label: 'Executed',
      Icon: IconInfo,
      color: '#749C47',
    },
    [VOTE_STATUS_PAUSED]: {
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

  return (
    <Tag
      background={background && `${background}`}
      color={`${color}`}
      mode="indicator"
      label={label}
      icon={<Icon size="small" />}
    />
  )
}

DisputableStatusLabel.propTypes = {
  status: PropTypes.oneOf([
    VOTE_STATUS_ACCEPTED,
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_CANCELLED,
    VOTE_STATUS_DISPUTED,
    VOTE_STATUS_EXECUTED,
    VOTE_STATUS_PAUSED,
    VOTE_STATUS_REJECTED,
  ]),
}

export default DisputableStatusLabel
