import React, { useMemo, useState, useCallback } from 'react'
import SignOverview from './SignOverview'
import { useActions } from '../../../hooks/useActions'
import { useMounted } from '../../../hooks/useMounted'
import ModalFlowBase from '../ModalFlowBase'

function SignAgreementScreens() {
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
    ],
    [handleOnContinue]
  )
  return <ModalFlowBase transactions={transactions} screens={screens} />
}

export default SignAgreementScreens
