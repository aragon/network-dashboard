import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Header, GU } from '@aragon/ui'
import Layout from '../Layout'
import ProposalBanner from './ProposalBanner'
import ProposalCardGroup from './ProposalCardGroup'
import ProposalCard from './ProposalCard'
import { useAppData } from '../../providers/AppData'
import { useOrgApps } from '../../providers/OrgApps'

const Proposals = React.memo(function Proposals() {
  const { disputableVotingApp } = useOrgApps()
  const { disputableVotes } = useAppData()
  const history = useHistory()

  const handleProposalClick = (proposalId) => {
    history.push(`/proposals/${proposalId}`)
  }

  const [bannerClosed, setBannerClosed] = useState(
    localStorage.getItem('bannerClosed') === 'true'
  )

  const handleCloseBanner = useCallback(() => {
    localStorage.setItem('bannerClosed', 'true')
    setBannerClosed(true)
  }, [])

  const voteGroups = [
    ['Open votes', disputableVotes.filter(({ hasEnded }) => !hasEnded)],
    ['Closed votes', disputableVotes.filter(({ hasEnded }) => hasEnded)],
  ]

  return (
    <section>
      {!bannerClosed && (
        <ProposalBanner
          onCloseBanner={handleCloseBanner}
          css={`
            position: relative;
            z-index: 1;
          `}
        />
      )}
      <Layout
        css={`
          position: relative;
          z-index: 2;
          ${!bannerClosed ? `margin-top: -${3 * GU}px;` : ''}
        `}
      >
        <Header primary="Proposals" />
        {voteGroups.map(([groupName, votes]) =>
          votes.length ? (
            <ProposalCardGroup
              title={groupName}
              count={votes.length}
              key={groupName}
            >
              {votes.map((vote) => (
                <ProposalCard
                  key={vote.voteId}
                  vote={vote}
                  appAddress={disputableVotingApp.address}
                  onProposalClick={handleProposalClick}
                />
              ))}
            </ProposalCardGroup>
          ) : null
        )}
      </Layout>
    </section>
  )
})

export default Proposals
