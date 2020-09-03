import React from 'react'
import PropTypes from 'prop-types'
import { useLayout, GU } from '@aragon/ui'

function LayoutColumns({ primary, secondary }) {
  const { layoutName } = useLayout()
  const oneColumn = layoutName === 'small' || layoutName === 'medium'

  const primaryContent = (
    <div
      css={`
        flex-grow: 1;
      `}
    >
      {primary}
    </div>
  )

  const secondaryContent = (
    <div
      css={`
        flex-shrink: 0;
        min-width: 0;
        flex-grow: 0;
        width: ${oneColumn ? '100%' : `306px`};
        margin-left: ${!oneColumn ? 2 * GU : 0}px;
        margin-top: ${oneColumn ? 2 * GU : 0}px;
      `}
    >
      {secondary}
    </div>
  )

  return (
    <div
      css={`
        display: ${oneColumn ? 'block' : 'flex'};
      `}
    >
      {primaryContent}
      {secondaryContent}
    </div>
  )
}

LayoutColumns.propTypes = {
  primary: PropTypes.node,
  secondary: PropTypes.node,
}

export default LayoutColumns
