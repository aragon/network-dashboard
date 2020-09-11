import React from 'react'
import PropTypes from 'prop-types'
import { noop, GU } from '@aragon/ui'
import Stepper from '../Stepper/Stepper'
import { useWallet } from '../../providers/Wallet'

const indexNumber = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
}

function TransactionStepper({ transactions }) {
  const { ethers } = useWallet()

  const steps = transactions.map((transaction, index) => {
    return {
      // TODO: Add titles from description
      title: `${indexNumber[index]} transaction`,
      handleSign: async ({ setSuccess, setError, setHash }) => {
        try {
          const tx = await ethers.getSigner().sendTransaction(transaction)

          setHash(tx.hash)

          setSuccess()
        } catch (err) {
          console.error(err)
          setError()
        }
      },
    }
  })

  return (
    <Stepper
      steps={steps}
      css={`
        margin-top: ${3.25 * GU}px;
        margin-bottom: ${5.5 * GU}px;
      `}
    />
  )
}

export function modalWidthFromCount(count) {
  if (count >= 3) {
    return 865
  }

  if (count === 2) {
    return 700
  }

  // Modal will fallback to the default
  return null
}

TransactionStepper.propTypes = {
  transactions: PropTypes.array.isRequired,
}

TransactionStepper.defaultProps = {
  onComplete: noop,
}

export default TransactionStepper
