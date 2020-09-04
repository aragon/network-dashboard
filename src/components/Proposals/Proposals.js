import React, { useCallback, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LoadingSection from '../Loading/LoadingSection'
import ProposalBanner from './ProposalBanner'
import ProposalCardGroup from './ProposalCardGroup'
import ProposalCard from './ProposalCard'
import { useAppState } from '../../providers/AppState'
import { useVotes } from '../../providers/Votes'

const Proposals = React.memo(function Proposals() {
  const { votes, loading } = useVotes()

  const [bannerClosed, setBannerClosed] = useState(
    localStorage.getItem('bannerClosed') === 'true'
  )

  const handleCloseBanner = useCallback(() => {
    localStorage.setItem('bannerClosed', 'true')
    setBannerClosed(true)
  }, [])

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
          <LoadingSection title="Loading proposals" loading={loading}>
            <VotesLayout votes={votes} />
          </LoadingSection>
        </LayoutLimiter>
      </LayoutGutter>
    </section>
  )
})

function VotesLayout({ votes }) {
  const { disputableVotingApp } = useAppState()
  const history = useHistory()

  const handleProposalClick = useCallback(
    (proposalId) => {
      history.push(`/proposals/${proposalId}`)
    },
    [history]
  )

  const sortedVotes = useMemo(
    () =>
      [...votes].sort((a, b) => {
        const dateDiff = b.endDate - a.endDate
        // Order by descending voteId if there's no end date difference
        return dateDiff !== 0 ? dateDiff : b.voteId - a.voteId
      }),
    [votes]
  )

  const voteGroups = useMemo(
    () => [
      ['Open votes', sortedVotes.filter(({ hasEnded }) => !hasEnded)],
      ['Closed votes', sortedVotes.filter(({ hasEnded }) => hasEnded)],
    ],
    [sortedVotes]
  )

  return voteGroups.map(([groupName, votes]) =>
    votes.length ? (
      <ProposalCardGroup title={groupName} count={votes.length} key={groupName}>
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
  )
}

export default Proposals
