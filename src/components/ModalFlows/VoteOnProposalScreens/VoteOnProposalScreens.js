import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMounted } from '../../../hooks/useMounted'
import { useOrgApps } from '../../../providers/OrgApps'
import { useWallet } from '../../../providers/Wallet'
import ModalFlowBase from '../ModalFlowBase'

function VoteOnProposalScreens({ voteId, voteSupported }) {
  const mounted = useMounted()
  const { account } = useWallet()
  const { disputableVotingApp } = useOrgApps()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const transactionTitle = `Vote ${
    voteSupported ? 'yes' : 'no'
  } on vote #${voteId}`

  useEffect(() => {
    async function getTransactions() {
      try {
        // async castVote(voteNumber: string, supports: boolean, signerAddress: string)
        const { transactions } = await disputableVotingApp.castVote(
          voteId,
          voteSupported,
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
  }, [mounted, disputableVotingApp, account, voteId, voteSupported])

  return (
    <ModalFlowBase
      loading={loading}
      transactions={transactions}
      transactionTitle={transactionTitle}
    />
  )
}

VoteOnProposalScreens.propTypes = {
  voteId: PropTypes.string,
  voteSupported: PropTypes.bool,
}

export default VoteOnProposalScreens
