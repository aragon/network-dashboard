import React from 'react'
import PropTypes from 'prop-types'
import { GU, Info } from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_SETTLED,
  VOTE_STATUS_DISPUTED,
} from '../disputable-vote-statuses'

function StatusInfo({ vote }) {
  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  if (disputableStatus === VOTE_STATUS_CHALLENGED) {
    return (
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This vote has been paused as the result of the originating action being
        challenged. When the challenge is resolved, if allowed, the voting
        period will be resumed for the remaining of its duration time.
        Othersiwe, this vote will be canceled.
      </Info>
    )
  }

  if (disputableStatus === VOTE_STATUS_SETTLED) {
    return (
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This vote has been canceled as the result of the originating action
        being challenged and the settlement offer being accepted.
      </Info>
    )
  }

  if (disputableStatus === VOTE_STATUS_DISPUTED) {
    return (
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This vote has been paused as the result of the originating action being
        challenged and raised to Aragon Court. When the dispute is resolved, if
        allowed, the voting period will be resumed for the remaining of its
        duration time. Othersiwe, this vote will be canceled.
      </Info>
    )
  }

  if (disputableStatus === VOTE_STATUS_CANCELLED) {
    if (vote.disputeId) {
      return (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          This vote has been canceled as the result of Aragon Court's final jury
          outcome being to <strong>block this action</strong>.
        </Info>
      )
    }
    return (
      <Info
        mode="warning"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This vote has been canceled.
      </Info>
    )
  }

  return <div />
}

StatusInfo.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default StatusInfo
