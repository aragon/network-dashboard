import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
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

  let voteGroups = []
  if (disputableVotes) {
    voteGroups = [
      ['Open votes', disputableVotes.filter(({ hasEnded }) => !hasEnded)],
      ['Closed votes', disputableVotes.filter(({ hasEnded }) => hasEnded)],
    ]
  }

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
      <LayoutGutter
        css={`
          position: relative;
          z-index: 2;
        `}
      >
        <LayoutLimiter>
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
        </LayoutLimiter>
      </LayoutGutter>
    </section>
  )
})

export default Proposals
