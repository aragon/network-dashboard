import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import { useActions } from '../../../hooks/useActions'
import ChallengeRequirements from './ChallengeRequirements'

function ChallengeProposalScreens({ actionId }) {
  const { challengeProposal } = useActions()
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async (onComplete) => {
      await challengeProposal(
        {
          actionId: actionId,
          settlementOffer: '0',
          finishedEvidence: true,
          context: '',
        },
        (intent) => {
          setTransactions(intent.transactions)
          onComplete()
        }
      )
    },
    [actionId, challengeProposal]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Challenge action requirements',
        content: <ChallengeRequirements getTransactions={getTransactions} />,
      },
    ],
    [getTransactions]
  )

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Challenge proposal"
      screens={screens}
    />
  )
}

ChallengeProposalScreens.propTypes = {
  actionId: PropTypes.string,
}

export default ChallengeProposalScreens
