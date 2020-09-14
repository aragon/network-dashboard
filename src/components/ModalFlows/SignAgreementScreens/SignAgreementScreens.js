import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'
import { useMounted } from '../../../hooks/useMounted'
import { useWallet } from '../../../providers/Wallet'
import { useOrgApps } from '../../../providers/OrgApps'
import { useAgreementState } from '../../../providers/AgreementState'

function SignAgreementScreens() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { agreementApp } = useOrgApps()
  const {
    agreement: { versionId },
  } = useAgreementState()
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async (onComplete) => {
      try {
        const { transactions } = await agreementApp.sign(account, versionId)

        if (mounted()) {
          setTransactions(transactions)
          onComplete()
        }
      } catch (err) {
        console.error(err)
      }
    },
    [account, agreementApp, versionId, mounted]
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
