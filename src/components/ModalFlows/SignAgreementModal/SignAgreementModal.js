import React, { useMemo, useState, useCallback } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import SignOverview from './SignOverview'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'
import { useActions } from '../../../hooks/useActions'
import { useMounted } from '../../../hooks/useMounted'

function SignAgreementModal() {
  const mounted = useMounted()
  const { signAgreement } = useActions()
  const [transactions, setTransactions] = useState([])

  const handleOnContinue = useCallback(
    async (onComplete) => {
      try {
        const { transactions } = await signAgreement()

        if (mounted()) {
          setTransactions(transactions)
        }

        onComplete()
      } catch (err) {
        console.error(err)
      }
    },
    [signAgreement, mounted]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Sign Agreement',
        graphicHeader: true,
        content: <SignOverview onContinue={handleOnContinue} />,
      },
      {
        title: 'Create transaction',
        width: modalWidthFromCount(transactions.length),
        content: <TransactionStepper transactions={transactions} />,
      },
    ],
    [transactions, handleOnContinue]
  )
  return <MultiModalScreens screens={screens} />
}

export default SignAgreementModal
