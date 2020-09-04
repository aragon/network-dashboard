import React from 'react'
import PropTypes from 'prop-types'
import { AppBadge, Card, GU, textStyle, useTheme } from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_PAUSED,
} from './disputable-vote-statuses'
import ProposalOption from './ProposalOption'
import DisputableStatusLabel from './DisputableStatusLabel'
import Description from './Description'
import { getAppPresentation } from '../../utils/app-utils'
import LoadingSkeleton from '../Loading/LoadingSkeleton'
import { useDescribeVote } from '../../hooks/useDescribeVote'
import { useAppState } from '../../providers/AppState'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_CANCELLED]: {
      backgroundColor: theme.surfacePressed,
      borderColor: theme.border,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_PAUSED]: {
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
      borderColor: theme.border,
      disabledProgressBars: false,
    }
  )
}

function ProposalCard({ vote, onProposalClick }) {
  const theme = useTheme()
  const { context, voteId, script } = vote
  const {
    description,
    emptyScript,
    targetApp,
    loading: descriptionLoading,
  } = useDescribeVote(script, vote.id)

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const { backgroundColor, borderColor, disabledProgressBars } = getAttributes(
    disputableStatus,
    theme
  )

  return (
    <Card
      onClick={() => onProposalClick(voteId)}
      css={`
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: auto 1fr auto auto;
        grid-gap: ${1 * GU}px;
        align-items: start;
        padding: ${3 * GU}px;
        background: ${backgroundColor};
        border: solid 1px ${borderColor};
      `}
    >
      <div
        css={`
          display: flex;
          margin-bottom: ${1 * GU}px;
        `}
      >
        {emptyScript ? (
          <DefaultAppBadge />
        ) : (
          <AppBadgeWithSkeleton
            targetApp={targetApp}
            loading={descriptionLoading}
          />
        )}
      </div>

      <p
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
        {emptyScript ? (
          <>
            <strong css="font-weight: bold">#{voteId}: </strong>
            {context || 'No description provided'}
          </>
        ) : (
          <DescriptionWithSkeleton
            description={description}
            loading={descriptionLoading}
            voteNumber={voteId}
          />
        )}
      </p>

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
    </Card>
  )
}

ProposalCard.propTypes = {
  vote: PropTypes.object,
  onProposalClick: PropTypes.func.isRequired,
}

function DefaultAppBadge() {
  const { apps, disputableVotingApp } = useAppState()

  const { humanName, iconSrc } = getAppPresentation(
    apps,
    disputableVotingApp.address
  )

  return (
    <AppBadge
      label={humanName}
      appAddress={disputableVotingApp.address}
      iconSrc={iconSrc}
      badgeOnly
    />
  )
}

/* eslint-disable react/prop-types */
function AppBadgeWithSkeleton({ targetApp, loading }) {
  if (loading) {
    return (
      <LoadingSkeleton
        css={`
          height: ${3 * GU}px;
          width: ${12 * GU}px;
        `}
      />
    )
  }

  const { address, name, icon } = targetApp

  return (
    <AppBadge
      label={name || address}
      appAddress={address}
      iconSrc={icon}
      badgeOnly
    />
  )
}

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
      <Description path={description} />
    </>
  )
}
/* eslint-enable react/prop-types */

export default ProposalCard
