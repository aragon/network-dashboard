import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'
import { useAgreementState } from '../../../providers/AgreementState'
import { useActions } from '../../../hooks/useActions'

function SignAgreementScreens() {
  const {
    agreement: { versionId },
  } = useAgreementState()
  const { signAgreement } = useActions()
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async (onComplete) => {
      await signAgreement({ versionId }, (intent) => {
        setTransactions(intent.transactions)
        onComplete()
      })
    },
    [signAgreement, versionId]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Sign Agreement',
        graphicHeader: true,
        content: <SignOverview getTransactions={getTransactions} />,
      },
    ],
    [getTransactions]
  )
  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Sign Agreement"
      screens={screens}
    />
  )
}

export default SignAgreementScreens
