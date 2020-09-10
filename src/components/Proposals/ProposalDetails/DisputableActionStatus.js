import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, Info, Link, textStyle, useTheme } from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_SCHEDULED,
  VOTE_STATUS_CHALLENGED,
} from '../disputable-vote-statuses'
import DisputableActions from './DisputableActions'
import DisputablePeriod from './DisputablePeriod'
import { durationToHours, toMs } from '../../../utils/date-utils'
import { networkEnvironment } from '../../../current-environment'

function DisputableActionStatus({ vote }) {
  const theme = useTheme()
  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const challenged = disputableStatus === VOTE_STATUS_CHALLENGED
  const scheduled = disputableStatus === VOTE_STATUS_SCHEDULED
  const challengeEndDate = toMs(vote.challengeEndDate)
  const pausedAt = toMs(vote.pausedAt)
  const voteEndDate = toMs(vote.endDate)
  const extendedPeriod = toMs(vote.currentQuietEndingExtensionDuration)

  return (
    <Box heading="Disputable Action Status">
      <ul>
        <Item heading="Challenge period">
          <DisputablePeriod
            endDate={voteEndDate}
            paused={pausedAt !== 0 && pausedAt}
            label={pausedAt !== 0 && 'Paused'}
          />
        </Item>
        {challengeEndDate !== 0 && (
          <Item heading="Settlement period">
            <DisputablePeriod
              endDate={challengeEndDate}
              paused={!challenged && challengeEndDate}
              label={!challenged && 'Ended'}
            />
          </Item>
        )}
        {scheduled && vote.settings.quietEndingPeriod && (
          <Item heading="Quiet ending period">
            <span>
              Last {durationToHours(toMs(vote.settings.quietEndingPeriod))}{' '}
            </span>
            <span
              css={`
                color: ${theme.surfaceContentSecondary};
              `}
            >
              Hours
            </span>
          </Item>
        )}
        {scheduled && extendedPeriod > 0 && (
          <Item heading="Quiet ending extension">
            <span>{durationToHours(extendedPeriod)} </span>
            <span
              css={`
                color: ${theme.surfaceContentSecondary};
              `}
            >
              Hours
            </span>
          </Item>
        )}
        {vote.disputeId && (
          <Item heading="Dispute">
            <Link
              href={`${networkEnvironment.courtUrl}/#/disputes/${vote.disputeId}`}
            >
              Dispute #{vote.disputeId}
            </Link>
          </Item>
        )}
        {scheduled && (
          <Item>
            {parseInt(vote.pausedAt, 10) === 0 ? (
              <Info>
                The proposed action will be automatically executed if nobody
                challenges it during the challenge period and the result of the
                vote is cast with majority support.
              </Info>
            ) : (
              <Info>The proposed action cannot longer be challenged.</Info>
            )}
          </Item>
        )}

        <Item>
          <DisputableActions
            status={disputableStatus}
            submitter={vote.creator}
          />
        </Item>
      </ul>
    </Box>
  )
}

/* eslint-disable react/prop-types */
function Item({ heading, children }) {
  const theme = useTheme()
  return (
    <li
      css={`
        list-style: none;
        & + li {
          margin-top: ${2.5 * GU}px;
        }
      `}
    >
      {heading && (
        <h1
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
            display: block;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {heading}
        </h1>
      )}
      {children}
    </li>
  )
}
/* eslint-enable react/prop-types */

DisputableActionStatus.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default DisputableActionStatus
