import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ModalFlowBase from '../ModalFlowBase'
import { useMounted } from '../../../hooks/useMounted'
import { useOrgApps } from '../../../providers/OrgApps'
import { useWallet } from '../../../providers/Wallet'

function ChallengeProposalScreens({ actionId }) {
  const mounted = useMounted()
  const { agreementApp } = useOrgApps()
  const { account } = useWallet()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTransactions() {
      try {
        // actionNumber
        // settlementOffer
        // finishedEvidence
        // context
        // signerAddress
        // TODO: Replace these defaults with args for user provided values
        const { transactions } = await agreementApp.challenge(
          actionId,
          '0',
          true,
          '',
          account
        )

        if (mounted()) {
          setTransactions(transactions)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getTransactions()
  }, [mounted, actionId, agreementApp, account])

  return (
    <ModalFlowBase
      loading={loading}
      transactions={transactions}
      transactionTitle="Challenge proposal"
    />
  )
}

ChallengeProposalScreens.propTypes = {
  actionId: PropTypes.string,
}

export default ChallengeProposalScreens
