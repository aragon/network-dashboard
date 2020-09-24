import React from 'react'
import PropTypes from 'prop-types'
import { GU, Info } from '@aragon/ui'
import {
  VOTE_CANCELLED,
  VOTE_CHALLENGED,
  VOTE_SETTLED,
  VOTE_DISPUTED,
} from '../../../types/disputable-statuses'

function StatusInfo({ vote }) {
  const infoDescription = {
    [VOTE_DISPUTED]: (
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
        duration time. Otherwise, this vote will be cancelled.
      </InfoBox>
    ),
    [VOTE_CHALLENGED]: (
      <InfoBox>
        This vote has been paused as the result of the originating action being
        challenged. When the challenge is resolved, if allowed, the voting
        period will be resumed for the remaining of its duration time.
        Othersiwe, this vote will be cancelled.
      </InfoBox>
    ),
    [VOTE_SETTLED]: (
      <InfoBox>
        This vote has been cancelled as the result of the originating action
        being challenged and the settlement offer being accepted.
      </InfoBox>
    ),
    [VOTE_CANCELLED]: vote.disputeId ? (
      <InfoBox>
        This vote has been cancelled as the result of Aragon Court's final jury
        outcome being to <strong>block this action</strong>
      </InfoBox>
    ) : (
      <InfoBox>This vote has been cancelled.</InfoBox>
    ),
  }

  return <>{infoDescription[vote.disputableStatus]}</>
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
