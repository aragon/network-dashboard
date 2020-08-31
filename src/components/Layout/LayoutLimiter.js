import React from 'react'
import PropTypes from 'prop-types'

function LayoutLimiter({ children, ...props }) {
  return (
    <div
      css={`
        margin-left: auto;
        margin-right: auto;
        max-width: 1280px;
      `}
      {...props}
    >
      {children}
    </div>
  )
}

LayoutLimiter.propTypes = {
  children: PropTypes.node,
}

export default LayoutLimiter
