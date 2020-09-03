import React from 'react'
import { useTheme, GU, RADIUS } from '@aragon/ui'

function LoadingSkeleton({ ...props }) {
  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background-color: ${theme.disabled};

        width: 100%;
        height: ${2 * GU}px;

        &:not(:last-child) {
          margin-bottom: ${1 * GU}px;
        }
      `}
      {...props}
    />
  )
}

export default LoadingSkeleton
