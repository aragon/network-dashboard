import React, { useMemo, useState, useCallback } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import SignOverview from './SignOverview'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'
import { useAgreement } from '../../../providers/Agreement'
import { useWallet } from '../../../providers/Wallet'

function SignAgreementModal() {
  const { account } = useWallet()
  const { agreementDetails } = useAgreement()
  const [transactions, setTransactions] = useState([])

  const signAgreement = useCallback(
    async (onComplete) => {
      try {
        const { transactions } = await agreementDetails.sign(account)

        setTransactions(transactions)

        onComplete && onComplete()
      } catch (err) {
        console.error(err)
      }
    },
    [account, agreementDetails]
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
