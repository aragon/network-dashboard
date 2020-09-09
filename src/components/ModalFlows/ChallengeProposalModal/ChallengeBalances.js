import React from 'react'
import PropTypes from 'prop-types'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function ChallengeBalances({ onContinue }) {
  const { next } = useMultiModal()

  return (
    <>
      <p>Continue to challenge this proposal</p>
      <ModalButton onClick={() => onContinue(next)}>Continue</ModalButton>
    </>
  )
}

ChallengeBalances.propTypes = {
  onContinue: PropTypes.func.isRequired,
}

export default ChallengeBalances
