import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GU, ProgressBar, RADIUS, textStyle, useTheme } from '@aragon/ui'

function ProposalOption({ color, label, percentage }) {
  const theme = useTheme()
  return (
    <Main>
      <Labels>
        <span
          css={`
            ${textStyle('label2')}
          `}
        >
          {label}
        </span>
        <span
          css={`
            ${textStyle('body4')}
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {percentage}%
        </span>
      </Labels>
      <div
        css={`
          overflow: hidden;
          background: ${theme.surfaceUnder};
          border-radius: ${RADIUS}px;
        `}
      >
        <ProgressBar value={percentage / 100} color={color || theme.positive} />
      </div>
    </Main>
  )
}

ProposalOption.propTypes = {
  color: PropTypes.object,
  percentage: PropTypes.number,
  label: PropTypes.node,
}

const Main = styled.div`
  & + & {
    margin-top: ${1 * GU}px;
  }
`

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${0.5 * GU}px;
`

export default React.memo(ProposalOption)
