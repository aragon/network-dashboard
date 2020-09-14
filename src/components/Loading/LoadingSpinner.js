import React from 'react'
import PropTypes from 'prop-types'
import { css, keyframes } from 'styled-components'
import { GU } from '@aragon/ui'

const ringSpinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 0.6s linear infinite;
`

const sizes = {
  small: {
    dimension: 2.25 * GU,
    borderWidth: 2,
  },
  large: {
    dimension: 8 * GU,
    borderWidth: 3,
  },
}

function LoadingSpinner({ size, ...props }) {
  const { dimension, borderWidth } = sizes[size]

  return (
    <div
      css={`
        border-radius: 100%;
        width: ${dimension}px;
        height: ${dimension}px;
        color: inherit;
        border: ${borderWidth}px solid currentColor;

        ${ringSpinAnimation}
      `}
      {...props}
    />
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
}

LoadingSpinner.defaultProps = {
  size: 'large',
}

export default LoadingSpinner
