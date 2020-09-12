import React from 'react'
import { css, keyframes } from 'styled-components'
import { useTheme, GU } from '@aragon/ui'

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

function LoadingSpinner() {
  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: 100%;
        width: ${8 * GU}px;
        height: ${8 * GU}px;
        color: ${theme.accent};
        border: 3px solid currentColor;

        ${ringSpinAnimation}
      `}
    />
  )
}

export default LoadingSpinner
