import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU } from '@aragon/ui'
import LoadingSpinner from '../Loading/LoadingSpinner'

function ModalButton({ children, loading, ...props }) {
  return (
    <Button
      mode="strong"
      wide
      css={`
        margin-top: ${2 * GU}px;
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="small"
          css={`
            margin-right: ${1 * GU}px;
          `}
        />
      )}
      {loading ? 'Loading…' : children}
    </Button>
  )
}

ModalButton.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
}

export default ModalButton
