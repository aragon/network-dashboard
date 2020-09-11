import React, { useMemo, useState, useCallback } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import SignOverview from './SignOverview'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'
import { useAgreementSign } from '../../../hooks/useAgreementSign'
import { useMounted } from '../../../hooks/useMounted'

function SignAgreementModal() {
  const mounted = useMounted()
  const { sign } = useAgreementSign()
  const [transactions, setTransactions] = useState([])

  const signAgreement = useCallback(
    async (onComplete) => {
      try {
        const { transactions } = await sign()

        if (mounted()) {
          setTransactions(transactions)
        }

        onComplete && onComplete()
      } catch (err) {
        console.error(err)
      }
    },
    [sign, mounted]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Sign Agreement',
        graphicHeader: true,
        content: <SignOverview onContinue={signAgreement} />,
      },
      {
        title: 'Create transaction',
        width: modalWidthFromCount(transactions.length),
        content: <TransactionStepper transactions={transactions} />,
      },
    ],
    [transactions, signAgreement]
  )
  return <MultiModalScreens screens={screens} />
}

export default SignAgreementModal
