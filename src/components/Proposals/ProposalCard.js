import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU } from '@aragon/ui'

function ProposalCard({ vote, onProposalClick }) {
  const { voteId, context } = vote
  return (
    <Card
      onClick={() => onProposalClick(voteId)}
      css={`
        padding: ${3 * GU}px;
      `}
    >
      <p>{context}</p>
    </Card>
  )
}

ProposalCard.propTypes = {
  vote: PropTypes.object.isRequired,
  onProposalClick: PropTypes.func.isRequired,
}

export default ProposalCard
