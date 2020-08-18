import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme, GU } from '@aragon/ui'

function Header() {
  const theme = useTheme()

  return (
    <header
      css={`
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
    </header>
  )
}

export default Header
