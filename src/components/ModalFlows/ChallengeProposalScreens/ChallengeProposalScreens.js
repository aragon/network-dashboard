import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import { useActions } from '../../../hooks/useActions'

function ChallengeProposalScreens({ actionId }) {
  const { challengeProposal } = useActions()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTransactions() {
      // TODO: Replace happy path defaults
      await challengeProposal(
        {
          actionId: actionId,
          settlementOffer: '0',
          finishedEvidence: true,
          context: '',
        },
        (intent) => {
          setTransactions(intent.transactions)
          setLoading(false)
        }
      )
    }

    getTransactions()
  }, [actionId, challengeProposal])

  return (
    <ModalFlowBase
      loading={loading}
      transactions={transactions}
      transactionTitle="Challenge proposal"
    />
  )
}

ChallengeProposalScreens.propTypes = {
  actionId: PropTypes.string,
}

export default ChallengeProposalScreens
