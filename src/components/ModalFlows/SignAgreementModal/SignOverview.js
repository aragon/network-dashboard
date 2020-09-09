import React from 'react'
import PropTypes from 'prop-types'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import ModalButton from '../ModalButton'

function SignOverview({ onContinue }) {
  const { next } = useMultiModal()
  return (
    <>
      <p>Continue to sign this agreement</p>
      <ModalButton
        mode="strong"
        onClick={() => {
          onContinue(next)
        }}
      >
        Continue
      </ModalButton>
    </>
  )
}

SignOverview.propTypes = {
  onContinue: PropTypes.func.isRequired,
}

export default SignOverview
