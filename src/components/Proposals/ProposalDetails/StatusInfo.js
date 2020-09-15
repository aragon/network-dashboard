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

  const infoDescription = {
    [VOTE_STATUS_DISPUTED]: (
      <InfoBox
        css={`
          background-color: #ffeaea;
          color: #ff7c7c;
          border-color: #ff7c7c;
        `}
      >
        This vote has been paused as the result of the originating action being
        challenged and raised to Aragon Court. When the dispute is resolved, if
        allowed, the voting period will be resumed for the remaining of its
        duration time. Othersiwe, this vote will be canceled.
      </InfoBox>
    ),
    [VOTE_STATUS_CHALLENGED]: (
      <InfoBox>
        This vote has been paused as the result of the originating action being
        challenged. When the challenge is resolved, if allowed, the voting
        period will be resumed for the remaining of its duration time.
        Othersiwe, this vote will be canceled.
      </InfoBox>
    ),
    [VOTE_STATUS_SETTLED]: (
      <InfoBox>
        This vote has been canceled as the result of the originating action
        being challenged and the settlement offer being accepted.
      </InfoBox>
    ),
    [VOTE_STATUS_CANCELLED]: vote.disputeId ? (
      <InfoBox>
        This vote has been canceled as the result of Aragon Court's final jury
        outcome being to <strong>block this action</strong>
      </InfoBox>
    ) : (
      <InfoBox>This vote has been canceled.</InfoBox>
    ),
  }

  return <>{infoDescription[disputableStatus]}</>
}

StatusInfo.propTypes = {
  vote: PropTypes.object.isRequired,
}

/* eslint-disable react/prop-types */
function InfoBox({ children, ...props }) {
  return (
    <Info
      mode="warning"
      css={`
        margin-top: ${2 * GU}px;
      `}
      {...props}
    >
      {children}
    </Info>
  )
}
/* eslint-enable react/prop-types */

export default StatusInfo
