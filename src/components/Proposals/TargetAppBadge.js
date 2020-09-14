import React from 'react'
import { AppBadge, GU } from '@aragon/ui'
import { useDescribeVote } from '../../hooks/useDescribeVote'
import { useOrgApps } from '../../providers/OrgApps'
import { getAppPresentation } from '../../utils/app-utils'
import LoadingSkeleton from '../Loading/LoadingSkeleton'

/* eslint-disable react/prop-types */
function TargetAppBadge({ script, voteId }) {
  const { emptyScript, targetApp, loading } = useDescribeVote(script, voteId)

  return (
    <>
      {emptyScript ? (
        <DefaultAppBadge />
      ) : (
        <AppBadgeWithSkeleton targetApp={targetApp} loading={loading} />
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

export default TargetAppBadge
