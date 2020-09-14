import React from 'react'
import PropTypes from 'prop-types'
import { AppBadge, GU } from '@aragon/ui'
import { useDescribeVote } from '../../hooks/useDescribeVote'
import { useOrgApps } from '../../providers/OrgApps'
import { getAppPresentation } from '../../utils/app-utils'
import LoadingSkeleton from '../Loading/LoadingSkeleton'

function TargetApp({ vote }) {
  const {
    emptyScript,
    targetApp,
    loading: descriptionLoading,
  } = useDescribeVote(vote.script, vote.id)

  return (
    <>
      {emptyScript ? (
        <DefaultAppBadge />
      ) : (
        <AppBadgeWithSkeleton
          targetApp={targetApp}
          loading={descriptionLoading}
        />
      )}
    </>
  )
}

function DefaultAppBadge() {
  const { apps, disputableVotingApp } = useOrgApps()

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
/* eslint-disable react/prop-types */

TargetApp.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default TargetApp
