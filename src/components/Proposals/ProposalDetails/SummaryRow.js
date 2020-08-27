import React from 'react'
import styled from 'styled-components'
import { formatTokenAmount, GU, textStyle, useTheme } from '@aragon/ui'

/* eslint-disable react/prop-types */
function SummaryRow({ color, label, pct, token }) {
  // TODO: get real token decimals
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        width: 100%;
        margin-bottom: ${1 * GU}px;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        ${textStyle('body2')};
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <Bullet color={color} />
        <div
          css={`
            width: ${4 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {label}
        </div>
        <div>{pct}%</div>
      </div>
      <div
        css={`
          color: ${theme.surfaceContentSecondary};
          margin-left: ${2 * GU}px;
        `}
      >
        {formatTokenAmount(token.amount, token.decimals, {
          symbol: token.symbol,
        })}
      </div>
    </div>
  )
}

const Bullet = styled.div`
  flex-shrink: 0;
  display: block;
  width: ${1 * GU}px;
  height: ${1 * GU}px;
  margin-right: ${2 * GU}px;
  border-radius: 50%;
  background: ${({ color }) => color};
`
/* eslint-disable react/prop-types */

export default React.memo(SummaryRow)
