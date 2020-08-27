import React, { useCallback } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { GU, Link, IconExternal, useTheme, unselectable } from '@aragon/ui'
import HeaderLogo from './HeaderLogo'
import Layout from '../Layout'

function Header({ ...props }) {
  const theme = useTheme()
  const history = useHistory()

  const handleLogoClick = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <header
      css={`
        height: ${8 * GU}px;
        box-shadow: 0px 0px 10px rgba(160, 168, 194, 0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: ${theme.surface};
      `}
      {...props}
    >
      <Layout>
        <div
          css={`
            display: flex;
          `}
        >
          <Link onClick={handleLogoClick}>
            <HeaderLogo />
          </Link>
          <nav
            css={`
              display: inline-grid;
              grid-auto-flow: column;
              grid-gap: ${4 * GU}px;
              margin-left: ${5 * GU}px;
            `}
          >
            <NavItem>
              <InteralLink to="/proposals">Proposals</InteralLink>
            </NavItem>

            <NavItem>
              <InteralLink to="/agreement">Agreement</InteralLink>
            </NavItem>
            <NavItem>
              <Link
                href="https://app.uniswap.org/#/swap?outputCurrency=0x960b236A07cf122663c4303350609A66A7B288C0"
                css={`
                  display: flex;
                  align-items: center;
                  text-decoration: none;
                  color: ${theme.contentSecondary};
                  ${unselectable};
                `}
              >
                Get ANT
                <IconExternal
                  size="small"
                  css={`
                    margin-left: ${0.5 * GU}px;
                  `}
                />
              </Link>
            </NavItem>
          </nav>
        </div>
      </Layout>
    </header>
  )
}

/* eslint-disable react/prop-types */
function InteralLink({ to, children }) {
  const history = useHistory()
  const theme = useTheme()
  const active = useRouteMatch(to) !== null

  const handlePageRequest = useCallback(() => {
    history.push(to)
  }, [history, to])

  return (
    <Link
      onClick={handlePageRequest}
      css={`
        ${unselectable};
        text-decoration: none;
        color: ${theme.contentSecondary};

        ${active ? `color: ${theme.content}` : ''};
      `}
    >
      {children}
    </Link>
  )
}

function NavItem({ children }) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {children}
    </div>
  )
}
/* eslint-enable react/prop-types */

export default Header
