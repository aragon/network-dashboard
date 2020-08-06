import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU } from '@aragon/ui'

function ProposalCard({ vote, onProposalClick }) {
  const { voteId, context } = vote

  return (
    <Card
      onClick={() => onProposalClick(voteId)}
      css={`
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: auto 1fr auto auto;
        grid-gap: ${1 * GU}px;
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
