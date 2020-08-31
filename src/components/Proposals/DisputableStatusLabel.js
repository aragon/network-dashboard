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
import {
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_ACTIVE,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_EXECUTED,
  VOTE_STATUS_PAUSED,
  VOTE_STATUS_REJECTED,
} from './disputable-vote-statuses'
import disputed from '../../assets/disputed.svg'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_ACTIVE]: {
      label: 'Scheduled',
      icon: <IconClock size="small" />,
    },
    [VOTE_STATUS_ACCEPTED]: {
      background: theme.surface,
      label: 'Passed',
      icon: <IconCheck size="small" />,
      color: theme.positive,
    },
    [VOTE_STATUS_CANCELLED]: {
      background: theme.surfaceUnder,
      label: 'Cancelled',
      icon: <IconClose size="small" />,
      color: theme.disabledContent,
    },
    [VOTE_STATUS_DISPUTED]: {
      background: '#FFEAEA',
      label: 'Disputed',
      icon: <img src={disputed} />,
      color: '#FF7C7C',
    },
    [VOTE_STATUS_EXECUTED]: {
      background: '#CADFAB',
      label: 'Passed (enacted)',
      icon: <IconInfo size="small" />,
      color: '#749C47',
    },
    [VOTE_STATUS_PAUSED]: {
      background: theme.warningSurface,
      label: 'Challenged',
      icon: <IconAttention size="small" />,
      color: theme.warningSurfaceContent,
    },
    [VOTE_STATUS_REJECTED]: {
      background: theme.surface,
      label: 'Rejected',
      icon: <IconCross size="small" />,
      color: theme.negative,
    },
  }

  return attributes[status]
}

function DisputableStatusLabel({ status }) {
  const theme = useTheme()
  const { icon, background, color, label } = getAttributes(status, theme)

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
        {icon}
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
      icon={icon}
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
