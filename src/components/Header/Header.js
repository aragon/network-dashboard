import React from 'react'
import { Link } from 'react-router-dom'
import { GU } from '@aragon/ui'

function Header() {
  return (
    <header
      css={`
        display: inline-grid;
        grid-auto-flow: column;
        grid-gap: ${3 * GU}px;
      `}
    >
      <Link to="/proposals">Proposals</Link>
      <Link to="/agreement">Agreement</Link>
    </header>
  )
}

export default Header
