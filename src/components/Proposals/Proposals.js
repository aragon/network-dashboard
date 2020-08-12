import React from 'react'
import { useHistory } from 'react-router-dom'
import { CardLayout, GU } from '@aragon/ui'
import { useDisputableVotingLogic } from '../../hooks/disputable-voting-logic'
import ProposalCard from './ProposalCard'

const Proposals = React.memo(function Proposals() {
  const history = useHistory()
  const { votes } = useDisputableVotingLogic()

  const handleProposalClick = (proposalId) => {
    history.push(`/proposals/${proposalId}`)
  }

  return (
    <>
      <section>
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
