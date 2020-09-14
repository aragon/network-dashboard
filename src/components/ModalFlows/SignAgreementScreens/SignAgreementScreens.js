import React, { useMemo, useState, useEffect } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import SignOverview from './SignOverview'
import { useMounted } from '../../../hooks/useMounted'
import { useWallet } from '../../../providers/Wallet'
import { useOrgApps } from '../../../providers/OrgApps'
import { useAgreementState } from '../../../providers/AgreementState'

function SignAgreementScreens() {
  const [loading, setLoading] = useState(true)
  const mounted = useMounted()
  const { account } = useWallet()
  const { agreementApp } = useOrgApps()
  const {
    agreement: { versionId },
  } = useAgreementState()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    async function getTransactions() {
      try {
        const { transactions } = await agreementApp.sign(account, versionId)

        if (mounted()) {
          setTransactions(transactions)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getTransactions()
  }, [mounted, agreementApp, account, versionId])

  const screens = useMemo(
    () => [
      {
        title: 'Sign Agreement',
        graphicHeader: true,
        content: <SignOverview />,
      },
    ],
    []
  )
  return (
    <ModalFlowBase
      loading={loading}
      transactions={transactions}
      screens={screens}
    />
  )
}

export default SignAgreementScreens
