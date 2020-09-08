import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, useTheme } from '@aragon/ui'
import globalError from '../../assets/globalError.svg'
import backgroundError from '../../assets/backgroundError.svg'
import logo from '../../assets/aragonNetworkLogo.svg'
import LayoutGutter from '../Layout/LayoutGutter'

function GlobalErrorScreen({ children }) {
  const theme = useTheme()
  return (
    <div
      css={`
        height: 100vh;
        min-width: ${45 * GU}px;
        overflow: auto;
        background: url(${backgroundError});
        background-size: cover;
        background-position: center;
        border-top-style: solid;
        border-top-width: 4px;
        border-top-color: ${theme.accent};
      `}
    >
      <img
        css={`
          position: absolute;
          top: ${3 * GU}px;
          left: ${3 * GU}px;
          width: ${6 * GU}px;
          height: ${6 * GU}px;
        `}
        src={logo}
      />
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100%;
          padding-top: ${8 * GU}px;
          padding-bottom: ${8 * GU}px;
        `}
      >
        <LayoutGutter>
          <Card
            css={`
              display: block;
              padding: ${5 * GU}px;
              width: 100%;
              max-width: ${72 * GU}px;
              height: auto;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              cursor: unset;
            `}
          >
            <img
              src={globalError}
              alt=""
              width="147"
              height="144"
              css={`
                display: block;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: ${3 * GU}px;
              `}
            />
            {children}
          </Card>
        </LayoutGutter>
      </div>
    </div>
  )
}

GlobalErrorScreen.propTypes = {
  children: PropTypes.node,
}

export default GlobalErrorScreen
