import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@aragon/ui'
import Layout from '../Layout'
import ProposalBanner from './ProposalBanner'
import ProposalCardGroup from './ProposalCardGroup'
import ProposalCard from './ProposalCard'
import { useVotes } from '../../hooks/disputable-voting-logic'

const Proposals = React.memo(function Proposals() {
  const history = useHistory()
  const { app, votes } = useVotes()

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

  if (votes === null) {
    return <div>Loading</div>
  }

  const voteGroups = [
    ['Open votes', votes.filter((vote) => vote.hasEnded === false)],
    ['Closed votes', votes.filter((vote) => vote.hasEnded === true)],
  ]

  return (
    <section>
      {!bannerClosed && <ProposalBanner onCloseBanner={handleCloseBanner} />}
      <Layout>
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
                  appAddress={app.address}
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
