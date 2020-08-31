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
      <path
        fill="currentColor"
        stroke="currentColor"
        viewBox="0 0 13 13"
        d="M4.828 5.707l3.538-3.602 2.899 2.846-3.538 3.603zM4.636 7.532L5.89 8.758l-3.645 3.73-1.254-1.226zM3.47 4.476a.514.514 0 01-.008-.727L6.28.88a.514.514 0 01.727-.007l.626.616-3.537 3.602-.627-.615zM8.46 9.23l3.537-3.603.627.616a.514.514 0 01.007.727L9.814 9.838a.514.514 0 01-.727.007L8.46 9.23z"
      />
    </svg>
  )
}

IconDisputed.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small', 'tiny']),
}
export default IconDisputed
