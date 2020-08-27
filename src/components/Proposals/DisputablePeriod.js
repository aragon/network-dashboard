import React from 'react'
import PropTypes from 'prop-types'
import { Timer } from '@aragon/ui'
import { dateFormat } from '../../lib/date-utils'
import { useNow } from '../../hooks/useNow'

function DisputablePeriod({ endDate }) {
  const now = useNow()

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
