import React from 'react'
import { textStyle, useTheme, GU } from '@aragon/ui'
import PropTypes from 'prop-types'

function InfoField({ label, children, ...props }) {
  const theme = useTheme()

  return (
    <div {...props}>
      <h3
        css={`
          margin-bottom: ${0.75 * GU}px;
          color: ${theme.contentSecondary};
          ${textStyle('label2')};
        `}
      >
        {label}
      </h3>
      {children}
    </div>
  )
}

InfoField.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
}

export default InfoField
