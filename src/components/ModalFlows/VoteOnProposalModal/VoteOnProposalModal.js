import React, { useMemo, useCallback, useState } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import VoteActionDetails from './VoteActionDetails'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'

function VoteOnProposalModal() {
  const [transactions, setTransactions] = useState([])

  const voteOnProposal = useCallback(async (onComplete) => {
    try {
      setTransactions([])

      onComplete && onComplete()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const screens = useMemo(
    () => [
      {
        title: 'Vote on proposal',
        content: <VoteActionDetails onContinue={voteOnProposal} />,
      },
      {
        title: 'Create transaction',
        width: modalWidthFromCount(transactions.length),
        content: <TransactionStepper transactions={transactions} />,
      },
    ],
    [transactions, voteOnProposal]
  )

  return <MultiModalScreens screens={screens} />
}

export default VoteOnProposalModal
