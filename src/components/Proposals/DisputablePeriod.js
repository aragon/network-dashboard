import React from 'react'
import PropTypes from 'prop-types'
import { GU, Timer, useTheme } from '@aragon/ui'
import { dateFormat } from '../../lib/date-utils'
import { useNow } from '../../hooks/useNow'

function DisputablePeriod({ endDate }) {
  const theme = useTheme()
  const now = useNow()

  // TODO: get period from connector
  const period = 48

  return (
    <>
      {now > endDate ? (
        dateFormat(endDate, 'standard')
      ) : (
        <div
          css={`
            display: inline-flex;
          `}
        >
          <Timer end={new Date(endDate)} />{' '}
        </div>
      )}
    </>
  )
}

DisputablePeriod.propTypes = {
  endDate: PropTypes.number,
}

export default DisputablePeriod
