import React from 'react'
import { useHistory } from 'react-router-dom'
import { CardLayout, GU } from '@aragon/ui'
import ProposalCard from './ProposalCard'
import { useVotes } from '../../hooks/disputable-voting-logic'

const Proposals = React.memo(function Proposals() {
  const history = useHistory()
  const votes = useVotes()

  const handleProposalClick = (proposalId) => {
    history.push(`/proposals/${proposalId}`)
  }

  return (
    <>
      <section
        css={`
          // TODO: remove it later, when MainView has a limited layout
          width: 80vw;
          margin: auto;
        `}
      >
        {votes ? (
          <CardLayout columnWidthMin={30 * GU} rowHeight={294}>
            {votes.map((vote, index) => (
              <ProposalCard
                key={vote.voteId}
                vote={vote}
                onProposalClick={handleProposalClick}
              />
            ))}
          </CardLayout>
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </>
  )
})

export default Proposals
