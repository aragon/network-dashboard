import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, textStyle, useTheme, RADIUS } from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_CHALLENGED,
} from './disputable-vote-statuses'
import { useDescribeScript } from '../../hooks/useDescribeScript'
import Description from './Description'
import DisputableStatusLabel from './DisputableStatusLabel'
import LoadingSkeleton from '../Loading/LoadingSkeleton'
import ProposalOption from './ProposalOption'
import TargetAppBadge from './TargetAppBadge'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_CANCELLED]: {
      backgroundColor: theme.surfacePressed,
      borderColor: theme.border,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_CHALLENGED]: {
      backgroundColor: '#fefdfb',
      borderColor: theme.warning,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_DISPUTED]: {
      backgroundColor: '#FFFAFA',
      borderColor: '#FF7C7C',
      disabledProgressBars: true,
    },
  }

  return (
    attributes[status] || {
      backgroundColor: theme.surface,
      borderColor: theme.surface,
      disabledProgressBars: false,
    }
  )
}

function ProposalCard({ vote, onProposalClick }) {
  const theme = useTheme()
  const { context, voteId, script, id } = vote
  const { description, targetApp, status } = useDescribeScript(script, id)

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const { backgroundColor, borderColor, disabledProgressBars } = getAttributes(
    disputableStatus,
    theme
  )

  return (
    <Card onClick={() => onProposalClick(voteId)}>
      <div
        css={`
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: auto 1fr auto auto;
          grid-gap: ${1 * GU}px;
          align-items: start;
          padding: ${3 * GU}px;
          width: 100%;
          height: 100%;

          background: ${backgroundColor};
          border: solid 1px ${borderColor};
          border-radius: ${RADIUS}px;
        `}
      >
        <div
          css={`
            display: flex;
            margin-bottom: ${1 * GU}px;

            /* Prevent default cursor interruption when hovering badge */
            & > a {
              cursor: inherit;
            }
          `}
        >
          <TargetAppBadge
            useDefaultBadge={status.emptyScript}
            targetApp={targetApp}
            loading={status.loading}
          />
        </div>

        <div
          css={`
          // overflow-wrap:anywhere and hyphens:auto are not supported yet by
          // the latest versions of Safari (as of June 2020), which
          // is why word-break:break-word has been added here.
          hyphens: auto;
          overflow-wrap: anywhere;
          word-break: break-word;
          ${textStyle('body1')}
          height: ${27 * 3}px; // 27px * 3 = line-height * 3 lines
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        `}
        >
          {status.emptyScript ? (
            <p>
              <strong css="font-weight: bold">#{voteId}: </strong>
              {context || 'No description provided'}
            </p>
          ) : (
            <DescriptionWithSkeleton
              description={description}
              loading={status.loading}
              voteNumber={voteId}
            />
          )}
        </div>

        <ProposalOption
          color={disabledProgressBars ? theme.surfaceOpened : theme.positive}
          percentage={(vote.yeas * 100) / vote.totalPower}
          label="Yes"
        />

        <ProposalOption
          color={disabledProgressBars ? theme.surfaceOpened : theme.negative}
          percentage={(vote.nays * 100) / vote.totalPower}
          label="No"
        />

        <div
          css={`
            display: flex;
            margin-top: ${2 * GU}px;
          `}
        >
          <DisputableStatusLabel
            status={DISPUTABLE_VOTE_STATUSES.get(vote.status)}
          />
        </div>
      </div>
    </Card>
  )
}

ProposalCard.propTypes = {
  vote: PropTypes.object,
  onProposalClick: PropTypes.func.isRequired,
}

/* eslint-disable react/prop-types */

function DescriptionWithSkeleton({ description, voteNumber, loading }) {
  if (loading) {
    return (
      <>
        <LoadingSkeleton
          css={`
            width: 95%;
          `}
        />
        <LoadingSkeleton
          css={`
            width: 70%;
          `}
        />
        <LoadingSkeleton
          css={`
            width: 35%;
          `}
        />
      </>
    )
  }

  return (
    <>
      <strong css="font-weight: bold">#{voteNumber}: </strong>{' '}
      <Description disableBadgeInteraction path={description} />
    </>
  )
}
/* eslint-enable react/prop-types */

export default ProposalCard
