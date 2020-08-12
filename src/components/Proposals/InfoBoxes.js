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
import { dateFormat, toMs } from '../../utils/date-utils'
import { round, safeDiv } from '../../utils/math-utils'
import SummaryBar from './SummaryBar'

function InfoBoxes({ vote }) {
  // TODO: get vote support and minimum approval from connector
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
          <SummaryWithPercentages size={support} requiredSize={0.5} />
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
          <SummaryWithPercentages size={quorumProgress} requiredSize={0.2} />
        </Box>
      </div>
    </div>
  )
}

function SummaryWithPercentages({ size, requiredSize }) {
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
          (&gt;{round(requiredSize * 100, 2)}% needed)
        </span>
      </div>
      <SummaryBar
        positiveSize={size}
        requiredSize={requiredSize}
        css={`
          margin-top: ${2 * GU}px;
        `}
      />
    </>
  )
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

InfoBoxes.propTypes = {
  vote: PropTypes.object.isRequired,
}

Status.propTypes = {
  vote: PropTypes.object.isRequired,
}

SummaryWithPercentages.propTypes = {
  size: PropTypes.number,
  requiredSize: PropTypes.number,
}

export default InfoBoxes
