import React from 'react'
import PropTypes from 'prop-types'
import { GU, Timer, useTheme } from '@aragon/ui'
import { dateFormat } from '../../utils/date-utils'

function DisputablePeriod({ endDate }) {
  const theme = useTheme()
  const now = new Date().getTime()
  // TODO: get period from connector
  const period = 48

  return (
    <React.Fragment>
      {now > endDate ? (
        dateFormat(endDate, 'standard')
      ) : (
        <div
          css={`
            display: inline-flex;
          `}
        >
          <Timer end={endDate} />{' '}
          <div
            css={`
              padding-left: ${1 * GU}px;
              color: ${theme.contentSecondary};
            `}
          >
            ({period} h)
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

DisputablePeriod.propTypes = {
  startDate: PropTypes.number,
}
export default DisputablePeriod
