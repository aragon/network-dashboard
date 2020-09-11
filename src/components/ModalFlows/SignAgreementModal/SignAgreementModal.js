import React, { useMemo, useState, useCallback } from 'react'
import MultiModalScreens from '../../MultiModal/MultiModalScreens'
import SignOverview from './SignOverview'
import TransactionStepper, { modalWidthFromCount } from '../TransactionStepper'
import { useAgreementSign } from '../../../hooks/useAgreementSign'
import { useWallet } from '../../../providers/Wallet'
import { useMounted } from '../../../hooks/useMounted'

function SignAgreementModal() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { sign } = useAgreementSign()
  const [transactions, setTransactions] = useState([])

  const signAgreement = useCallback(
    async (onComplete) => {
      try {
        const { transactions } = await sign(account)

        if (mounted()) {
          setTransactions(transactions)
        }

        onComplete && onComplete()
      } catch (err) {
        console.error(err)
      }
    },
    [account, sign, mounted]
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
