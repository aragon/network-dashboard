import React from 'react'
import { Box, textStyle, LoadingRing, GU } from '@aragon/ui'
import loadingGraphic from '../../assets/loading.svg'

function ProposalLoading() {
  return (
    <Box>
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: ${11 * GU}px;
          padding-bottom: ${11 * GU}px;
        `}
      >
        <img
          src={loadingGraphic}
          alt=""
          css={`
            display: block;
            max-width: 100%;
            width: ${34 * GU}px;
          `}
        />

        <span
          css={`
            display: flex;
            align-items: center;
            margin-top: ${4 * GU}px;
          `}
        >
          <div
            css={`
              margin-right: 16px;
            `}
          >
            <LoadingRing mode="half-circle" />
          </div>
          <h1
            css={`
              ${textStyle('title3')}
              line-height: 1.2;
            `}
          >
            Loading proposal…
          </h1>
        </span>
      </div>
    </Box>
  )
}

export default ProposalLoading
