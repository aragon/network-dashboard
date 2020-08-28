import React from 'react'
import PropTypes from 'prop-types'
import { Box, Help, textStyle, useLayout, useTheme, GU } from '@aragon/ui'

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
            <Help hint="What is Support?">
              <strong>Support</strong> is the relative percentage of tokens that
              are required to vote “Yes” for a proposal to be approved. For
              example, if “Support” is set to 50%, then more than 50% of the
              tokens used to vote on a proposal must vote “Yes” for it to pass.
            </Help>
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
            <Help hint="What is Minimum Approval?">
              <strong>Minimum Approval</strong> is the percentage of the total
              token supply that is required to vote “Yes” on a proposal before
              it can be approved. For example, if the “Minimum Approval” is set
              to 20%, then more than 20% of the outstanding token supply must
              vote “Yes” on a proposal for it to pass.
            </Help>
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
          margin-top: ${1 * GU}px;
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
