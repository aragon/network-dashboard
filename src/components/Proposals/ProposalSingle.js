import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { BackButton, Bar, Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LoadingSection from '../Loading/LoadingSection'
import ProposalDetails from './ProposalDetails/ProposalDetails'
import { useVote } from '../../hooks/useVote'
import { ProposalNotFound } from '../../errors'

function ProposalSingle({ match }) {
  const { id: proposalId } = match.params
  const history = useHistory()
  const [vote, loading] = useVote(proposalId)

  // Throw to boundary if vote doesn't exist
  // TODO: Add a better check once we have access to the errors in connect
  useEffect(() => {
    if (!vote && !loading) {
      throw new ProposalNotFound(proposalId)
    }
  }, [proposalId, vote, loading])

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
