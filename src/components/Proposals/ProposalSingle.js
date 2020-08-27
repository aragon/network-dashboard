import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { BackButton, Bar, Header } from '@aragon/ui'
import Layout from '../Layout'
import ProposalDetails from './ProposalDetails/ProposalDetails'
import ProposalLoading from './ProposalLoading'
import { useDisputableVote } from '../../hooks/useDisputableVotes'

function ProposalSingle({ match }) {
  const { id: proposalId } = match.params
  const history = useHistory()
  const [vote, { loading }] = useDisputableVote(proposalId)

  const handleBack = useCallback(() => {
    history.push(`/proposals`)
  }, [history])

  return (
    <Layout>
      <Header primary="Proposals" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>

      {loading ? <ProposalLoading /> : <ProposalDetails vote={vote} />}
    </Layout>
  )
}

ProposalSingle.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default ProposalSingle
