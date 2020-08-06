import React from 'react'
import { CardLayout, GU } from '@aragon/ui'
import ProposalCard from './ProposalCard'
import { useAppLogic } from '../../app-logic'

const Proposals = React.memo(function Proposals() {
  const { selectProposal, getVotes } = useAppLogic()
  const votes = getVotes

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
                onProposalClick={selectProposal}
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
