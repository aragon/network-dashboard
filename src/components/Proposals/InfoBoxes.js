import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Help,
  IconTime,
  Timer,
  textStyle,
  useLayout,
  useTheme,
  GU,
} from '@aragon/ui'
import { dateFormat, toMs } from '../../lib/date-utils'
import { round, safeDiv } from '../../lib/math-utils'
import SummaryBar from './SummaryBar'

function InfoBoxes({ vote, disabledProgressBars }) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const totalVotes = parseFloat(vote.yeas) + parseFloat(vote.nays)
  const support = safeDiv(parseFloat(vote.yeas), totalVotes)
  const quorumProgress = safeDiv(vote.yeas, vote.votingPower)
  return (
    <div
      css={`
        margin-top: ${2 * GU}px;
        display: grid;
        grid-template-columns: ${compactMode ? '1fr' : '1fr 1fr 1fr'};
        grid-template-rows: ${compactMode ? '1fr 1fr 1fr' : '1fr'};
        grid-gap: ${2 * GU}px;
      `}
    >
      <div>
        <Box
          heading="Status"
          css={`
            height: 100%;
          `}
          padding={(compactMode ? 2 : 3) * GU}
        >
          <Status vote={vote} />
        </Box>
      </div>
      <div>
        <Box
          heading={
            <>
              Support %
              <Help hint="What is Support?">
                <strong>Support</strong> is the relative percentage of tokens
                that are required to vote “Yes” for a proposal to be approved.
                For example, if “Support” is set to 50%, then more than 50% of
                the tokens used to vote on a proposal must vote “Yes” for it to
                pass.
              </Help>
            </>
          }
          css={`
            height: 100%;
          `}
          padding={(compactMode ? 2 : 3) * GU}
        >
          <SummaryWithPercentages
            disabledProgressBars={disabledProgressBars}
            size={support}
            requiredSize={parseFloat(vote.settings.formattedSupportRequiredPct)}
          />
        </Box>
      </div>
      <div>
        <Box
          heading={
            <>
              Minimum Approval %
              <Help hint="What is Minimum Approval?">
                <strong>Minimum Approval</strong> is the percentage of the total
                token supply that is required to vote “Yes” on a proposal before
                it can be approved. For example, if the “Minimum Approval” is
                set to 20%, then more than 20% of the outstanding token supply
                must vote “Yes” on a proposal for it to pass.
              </Help>
            </>
          }
          css={`
            height: 100%;
          `}
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
      </div>
    </div>
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
          (>{requiredSize}% needed)
        </span>
      </div>
      <SummaryBar
        disabledProgressBars={disabledProgressBars}
        positiveSize={size}
        requiredSize={requiredSize / 100}
        css={`
          margin-top: ${2 * GU}px;
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

function Status({ vote }) {
  const theme = useTheme()
  // TODO: get if vote is open
  const { endDate, executionDate, open } = vote

  if (open) {
    return (
      <>
        <div
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${1 * GU}px;
          `}
        >
          Time remaining
        </div>
        <Timer end={toMs(endDate)} maxUnits={4} />
      </>
    )
  }

  return (
    <>
      <div
        css={`
          margin-top: ${1 * GU}px;
          display: inline-grid;
          grid-auto-flow: column;
          grid-gap: ${1 * GU}px;
          align-items: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        <IconTime size="small" />{' '}
        {dateFormat(toMs(executionDate || endDate), 'standard')}
      </div>
    </>
  )
}

Status.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default InfoBoxes
