import React from 'react'
import { Link } from 'react-router-dom'

function Proposals() {
  return (
    <>
      Proposals view
      <div>
        <Link to="/proposals/1">Proposal 1</Link>
        <Link to="/proposals/2">Proposal 2</Link>
        <Link to="/proposals/3">Proposal 3</Link>
      </div>
    </>
  )
}

export default Proposals
