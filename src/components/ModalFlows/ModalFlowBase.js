import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { noop, GU } from '@aragon/ui'
import MultiModalScreens from '../MultiModal/MultiModalScreens'
import Stepper from '../Stepper/Stepper'
import { useWallet } from '../../providers/Wallet'

const indexNumber = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
}

function ModalFlowBase({ transactions, transactionTitle }) {
  const { ethers } = useWallet()

  const steps = transactions.map((transaction, index) => {
    const title =
      transactions.length === 1
        ? 'Sign transaction'
        : `${indexNumber[index]} transaction`

    return {
      // TODO: Add titles from description
      title,
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

  const screens = useMemo(
    () => [
      {
        graphicHeader: true,
        content: <div>hello</div>,
      },
      ...steps,
      {
        title: transactionTitle,
        width: modalWidthFromCount(transactions.length),
        content: (
          <Stepper
            steps={steps}
            css={`
              margin-top: ${3.25 * GU}px;
              margin-bottom: ${5.5 * GU}px;
            `}
          />
        ),
      },
    ],
    [transactions, steps, transactionTitle]
  )

  return <MultiModalScreens screens={screens} />
}

function modalWidthFromCount(count) {
  if (count >= 3) {
    return 865
  }

  if (count === 2) {
    return 700
  }

  // Modal will fallback to the default
  return null
}

ModalFlowBase.propTypes = {
  transactions: PropTypes.array.isRequired,
  transactionTitle: PropTypes.string,
}

ModalFlowBase.defaultProps = {
  onComplete: noop,
  transactionTitle: 'Create transaction',
}

export default ModalFlowBase
