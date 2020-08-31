import React from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'

const ICON_SIZES = new Map([
  ['large', 6 * GU],
  ['medium', 3 * GU],
  ['small', 2 * GU],
  ['tiny', 1.75 * GU],
])

function useIconSize(size) {
  return ICON_SIZES.get(size || 'medium')
}

function IconDisputed({ size, ...props }) {
  const sizeValue = useIconSize(size)
  return (
    <svg width={sizeValue} height={sizeValue} fill="none" {...props}>
      <g fill="currentColor">
        <path
          d="m4.82837 5.70697h5.04901v4.06286h-5.04901z"
          transform="matrix(.70064904 -.71350608 .71350608 .70064904 -2.626581 5.153458)"
        />
        <path
          d="m4.63574 7.53192h1.75352v5.21479h-1.75352z"
          transform="matrix(.71519278 .69892725 -.69892725 .71519278 6.584556 -1.0949)"
        />
        <path d="m3.46909 4.476c-.20258-.19893-.20554-.5244-.00661-.72698l2.81722-2.868918c.19892-.202573.5244-.205533.72697-.00661l.62678.615488-3.53758 3.6025z" />
        <path d="m8.45996 9.22961 3.53754-3.6025.6268.61549c.2026.19892.2056.5244.0066.72697l-2.81718 2.86892c-.19893.20261-.5244.20551-.72698.00661z" />
      </g>
    </svg>
  )
}

IconDisputed.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny']),
}
export default IconDisputed
