import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function ProposalDetail({ match }) {
  const { id: proposalId } = match.params

  return (
    <>
      <Link to="/proposals">Back to Proposals</Link>
      <div>
        Proposal detail view – ID:
        {proposalId}
      </div>
    </>
  )
}

ProposalDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default ProposalDetail
