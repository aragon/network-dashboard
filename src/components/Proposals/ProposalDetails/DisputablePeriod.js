import React from 'react'
import PropTypes from 'prop-types'
import { Timer, useTheme } from '@aragon/ui'
import { dateFormat } from '../../../lib/date-utils'

/* eslint-disable react/prop-types */
function DisputablePeriod({ endDate, paused, label }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: inline-flex;
      `}
    >
      {paused ? (
        <p>
          {label ? `(${label}) ` : ''}
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            {dateFormat(paused, 'standard')}
          </span>
        </p>
      ) : (
        <Timer end={new Date(endDate)} />
      )}
    </div>
  )
}
/* eslint-disable react/prop-types */

DisputablePeriod.propTypes = {
  endDate: PropTypes.number,
}

export default DisputablePeriod
