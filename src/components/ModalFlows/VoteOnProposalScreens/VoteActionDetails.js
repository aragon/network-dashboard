import React from 'react'
import PropTypes from 'prop-types'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function VoteActionDetails({ onContinue }) {
  const { next } = useMultiModal()
  return (
    <>
      <p>Vote on this proposal</p>
      <ModalButton
        onClick={() => {
          onContinue(next)
        }}
      >
        Continue
      </ModalButton>
    </>
  )
}

VoteActionDetails.propTypes = {
  onContinue: PropTypes.func.isRequired,
}

export default VoteActionDetails
