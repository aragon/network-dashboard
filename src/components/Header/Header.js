import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { GU, Link, useTheme } from '@aragon/ui'
import HeaderLogo from './HeaderLogo'

function Header() {
  const theme = useTheme()

  return (
    <header
      css={`
        height: ${8 * GU}px;
        box-shadow: 0px 2px 4px rgba(160, 168, 194, 0.16);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        background: ${theme.surface};
      `}
    >
      <nav
        css={`
          display: inline-grid;
          grid-auto-flow: column;
          grid-gap: ${4 * GU}px;
        `}
      >
        <HeaderLogo />
        <MenuItem to="/proposals">Proposals</MenuItem>
        <MenuItem to="/agreement">Agreement</MenuItem>
        <Link
          href="https://app.uniswap.org/#/swap?outputCurrency=0x960b236A07cf122663c4303350609A66A7B288C0"
          css={`
            text-decoration: none;
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary};
          `}
        >
          Get ANT
        </Link>
      </nav>
    </header>
  )
}

function MenuItem({ to, children }) {
  const theme = useTheme()
  return (
    <NavLink
      to={to}
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        color: theme.contentSecondary,
      }}
      activeStyle={{
        color: theme.content,
      }}
    >
      {children}
    </NavLink>
  )
}

MenuItem.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
}

export default Header
