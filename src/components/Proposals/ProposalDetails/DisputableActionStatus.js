import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, Info, Link, textStyle, useTheme } from '@aragon/ui'
import {
  VOTE_SCHEDULED,
  VOTE_CHALLENGED,
  VOTE_DISPUTED,
} from '../../../types/disputable-statuses'
import DisputableActions from './DisputableActions'
import DisputablePeriod from './DisputablePeriod'
import { durationToHours } from '../../../utils/date-utils'
import { networkEnvironment } from '../../../current-environment'

function DisputableActionStatus({ vote, onChallenge, onSettle, onRaise }) {
  const theme = useTheme()

  const {
    challengeEndDate,
    creator,
    disputableStatus,
    voterInfo,
    pausedAt,
    settledAt,
    endDate,
    extendedPeriod,
    quietEndingPeriod,
    disputeId,
  } = vote

  const challenged = disputableStatus === VOTE_CHALLENGED
  const scheduled = disputableStatus === VOTE_SCHEDULED
  const disputed = disputableStatus === VOTE_DISPUTED

  return (
    <Box heading="Disputable Action Status">
      <ul>
        <Item heading="Challenge period">
          <DisputablePeriod
            endDate={endDate}
            paused={pausedAt !== 0 && pausedAt}
            label={pausedAt !== 0 && 'Paused'}
          />
        </Item>
        {challengeEndDate !== 0 && (
          <Item heading="Settlement period">
            <DisputablePeriod
              endDate={settledAt > 0 ? settledAt : challengeEndDate}
              paused={!challenged && challengeEndDate}
              label={!challenged && 'Ended'}
            />
          </Item>
        )}
        {scheduled && quietEndingPeriod && (
          <Item heading="Quiet ending period">
            <span>Last {durationToHours(quietEndingPeriod)} </span>
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
        {disputeId && (
          <Item heading="Dispute">
            <Link
              href={`${networkEnvironment.courtUrl}/#/disputes/${disputeId}`}
              css={`
                text-decoration: none;
              `}
            >
              Dispute #{disputeId}{' '}
              <span
                css={`
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                ({disputed ? 'Drafting jury' : 'Ruling executed'})
              </span>
            </Link>
          </Item>
        )}
        {scheduled && (
          <Item>
            {pausedAt === 0 ? (
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
            voterAccount={voterInfo.account}
            status={disputableStatus}
            submitter={creator}
            onChallenge={onChallenge}
            onSettle={onSettle}
            onRaise={onRaise}
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
  onChallenge: PropTypes.func.isRequired,
  onSettle: PropTypes.func.isRequired,
  onRaise: PropTypes.func.isRequired,
}

export default DisputableActionStatus
