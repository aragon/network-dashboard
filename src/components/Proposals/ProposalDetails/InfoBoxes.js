import React from 'react'
import PropTypes from 'prop-types'
import { Box, textStyle, useLayout, useTheme, GU } from '@aragon/ui'
import HelpTip from '../../HelpTip'

import { round, safeDiv } from '../../../lib/math-utils'
import SummaryBar from './SummaryBar'

function InfoBoxes({ vote, disabledProgressBars }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const totalVotes = parseFloat(vote.yeas) + parseFloat(vote.nays)
  const support = safeDiv(parseFloat(vote.yeas), totalVotes)
  const quorumProgress = safeDiv(vote.yeas, vote.totalPower)
  return (
    <>
      <Box
        heading={
          <>
            Support %
            <HelpTip type="support-percentage" />
          </>
        }
        padding={(compactMode ? 2 : 3) * GU}
      >
        <SummaryWithPercentages
          disabledProgressBars={disabledProgressBars}
          size={support}
          requiredSize={parseFloat(vote.settings.formattedSupportRequiredPct)}
        />
      </Box>
      <Box
        heading={
          <>
            Minimum Approval %
            <HelpTip type="minimum-approval" />
          </>
        }
        padding={(compactMode ? 2 : 3) * GU}
      >
        <SummaryWithPercentages
          disabledProgressBars={disabledProgressBars}
          size={quorumProgress}
          requiredSize={parseFloat(
            vote.settings.formattedMinimumAcceptanceQuorumPct
          )}
        />
      </Box>
    </>
  )
}

InfoBoxes.propTypes = {
  disabledProgressBars: PropTypes.bool,
  vote: PropTypes.object.isRequired,
}

function SummaryWithPercentages({ disabledProgressBars, size, requiredSize }) {
  const theme = useTheme()

  return (
    <>
      <div
        css={`
          ${textStyle('body2')};
        `}
      >
        {round(size * 100, 2)}%{' '}
        <span
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          ({'>'}
          {requiredSize}% needed)
        </span>
      </div>
      <SummaryBar
        disabledProgressBars={disabledProgressBars}
        positiveSize={size}
        requiredSize={requiredSize / 100}
        css={`
          margin-top: ${1.5 * GU}px;
        `}
      />
    </>
  )
}

SummaryWithPercentages.propTypes = {
  disabledProgressBars: PropTypes.bool,
  size: PropTypes.number,
  requiredSize: PropTypes.number,
}

export default InfoBoxes
