import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { keyframes } from 'styled-components'
import { noop, GU } from '@aragon/ui'
import MultiModalScreens from '../MultiModal/MultiModalScreens'
import Stepper from '../Stepper/Stepper'
import { useWallet } from '../../providers/Wallet'
import { useMultiModal } from '../MultiModal/MultiModalProvider'
import LoadingSpinner from '../Loading/LoadingSpinner'

const indexNumber = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
}

function ModalFlowBase({
  frontLoad,
  loading,
  screens,
  transactions,
  transactionTitle,
}) {
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

  const extendedScreens = useMemo(() => {
    const allScreens = [
      ...screens,
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
    ]

    if (frontLoad) {
      allScreens.unshift({
        disableClose: true,
        content: <LoadingScreen loading={loading} />,
      })
    }

    return allScreens
  }, [transactions, screens, steps, transactionTitle, loading, frontLoad])

  return <MultiModalScreens screens={extendedScreens} />
}

/* eslint-disable react/prop-types */
function LoadingScreen({ loading }) {
  const { next } = useMultiModal()

  useEffect(() => {
    let timeout

    if (!loading) {
      // Provide a minimum appearance duration to avoid visual confusion on very fast requests
      timeout = setTimeout(() => {
        next()
      }, 100)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [loading, next])

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        padding-top: ${16 * GU}px;
        padding-bottom: ${16 * GU}px;
      `}
    >
      <div
        css={`
          animation: ${keyframes`
            from {
              transform: scale(1.3);
            }

            to {
              transform: scale(1);
            }
          `} 0.3s ease;
        `}
      >
        <LoadingSpinner />
      </div>
    </div>
  )
}
/* eslint-enable react/prop-types */

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
  frontLoad: PropTypes.bool,
  loading: PropTypes.bool,
  screens: PropTypes.array,
  transactions: PropTypes.array.isRequired,
  transactionTitle: PropTypes.string,
}

ModalFlowBase.defaultProps = {
  frontLoad: true,
  onComplete: noop,
  transactionTitle: 'Create transaction',
}

export default ModalFlowBase
