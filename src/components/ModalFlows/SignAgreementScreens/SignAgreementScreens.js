import React, { useMemo, useState, useEffect } from 'react'
import SignOverview from './SignOverview'
import { useActions } from '../../../hooks/useActions'
import { useMounted } from '../../../hooks/useMounted'
import ModalFlowBase from '../ModalFlowBase'

function SignAgreementScreens() {
  const mounted = useMounted()
  const { signAgreement } = useActions()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTransactions() {
      try {
        const { transactions } = await signAgreement()

        if (mounted()) {
          setTransactions(transactions)
        }

        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    getTransactions()
  }, [mounted, signAgreement])

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
