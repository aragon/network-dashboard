import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { BackButton, Bar, Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LoadingSection from '../Loading/LoadingSection'
import ProposalDetails from './ProposalDetails/ProposalDetails'
import { useDisputableVote } from '../../hooks/useDisputableVotes'

function ProposalSingle({ match }) {
  const { id: proposalId } = match.params
  const history = useHistory()
  const [vote, { loading }] = useDisputableVote(proposalId)

  const handleBack = useCallback(() => {
    history.push(`/proposals`)
  }, [history])

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Proposals" />
        <Bar>
          <BackButton onClick={handleBack} />
        </Bar>
        <LoadingSection loading={loading} title="Loading proposal">
          <ProposalDetails vote={vote} />
        </LoadingSection>
      </LayoutLimiter>
    </LayoutGutter>
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
