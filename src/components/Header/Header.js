import React from 'react'
<<<<<<< HEAD
import { Link } from 'react-router-dom'
import { useTheme, GU } from '@aragon/ui'
=======
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { GU, Link, useTheme } from '@aragon/ui'
import HeaderLogo from './HeaderLogo'
>>>>>>> Header

function Header() {
  const theme = useTheme()

  return (
    <header
      css={`
<<<<<<< HEAD
        background-color: ${theme.surface};
        padding: ${2 * GU}px;
      `}
    >
      <nav
        css={`
          display: inline-grid;
          grid-auto-flow: column;
          grid-gap: ${3 * GU}px;
        `}
      >
        <Link to="/proposals">Proposals</Link>
        <Link to="/agreement">Agreement</Link>
      </nav>
=======
        height: ${8 * GU}px;
        box-shadow: 0px 2px 4px rgba(160, 168, 194, 0.16);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-auto-flow: column;
          grid-gap: ${4 * GU}px;
        `}
      >
        <HeaderLogo />
        <MenuItem to="/proposals" name="Proposals" />
        <MenuItem to="/agreement" name="Agreement" />
        <Link
          href="https://app.uniswap.org/#/swap?outputCurrency=0x960b236A07cf122663c4303350609A66A7B288C0"
          css={`
            text-decoration: none;
            display: flex;
            align-items: center;
            font-weight: 300;
            color: ${theme.contentSecondary};
          `}
        >
          Get ANT
        </Link>
      </div>
>>>>>>> Header
    </header>
  )
}

function MenuItem({ to, name }) {
  const theme = useTheme()
  return (
    <NavLink
      to={to}
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '300',
        color: theme.contentSecondary,
      }}
      activeStyle={{
        fontWeight: '400',
        color: theme.content,
      }}
    >
      {name}
    </NavLink>
  )
}

MenuItem.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string,
}

export default Header
