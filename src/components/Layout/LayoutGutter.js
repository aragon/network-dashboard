import React from 'react'
import PropTypes from 'prop-types'
import { useLayout, GU } from '@aragon/ui'

function LayoutGutter({ children, collapseWhenSmall, ...props }) {
  const { layoutName } = useLayout()

  const smallPaddingAmount = collapseWhenSmall ? 0 : 2 * GU
  const paddingAmount =
    layoutName === 'small' ? `${smallPaddingAmount}px` : '5%'

  return (
    <div
      css={`
        padding-left: ${paddingAmount};
        padding-right: ${paddingAmount};
      `}
      {...props}
    >
      {children}
    </div>
  )
}

LayoutGutter.propTypes = {
  children: PropTypes.node,
  collapseWhenSmall: PropTypes.bool,
}

LayoutGutter.defaultProps = {
  collapseWhenSmall: true,
}

export default LayoutGutter
