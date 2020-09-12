import React, { useMemo, useState, useCallback } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import ChallengeBalances from './ChallengeBalances'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'
import { useMounted } from '../../../hooks/useMounted'

function ChallengeProposalScreens() {
  const mounted = useMounted()
  const [transactions, setTransactions] = useState([])

  const challengeProposal = useCallback(
    async (onComplete) => {
      try {
        if (mounted()) {
          setTransactions([])
        }

        onComplete && onComplete()
      } catch (err) {
        console.error(err)
      }
    },
    [mounted]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Challenge proposal',
        content: <ChallengeBalances onContinue={challengeProposal} />,
      },
      {
        title: 'Create transaction',

        width: modalWidthFromCount(transactions.length),
        content: <TransactionStepper transactions={transactions} />,
      },
    ],
    [transactions, challengeProposal]
  )
  return <MultiModalScreens screens={screens} />
}

export default ChallengeProposalScreens
