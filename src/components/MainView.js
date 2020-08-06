import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header/Header'

function MainView({ children }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <div
        css={`
          flex-shrink: 0;
        `}
      >
        <Header />
      </div>
      <main
        css={`
          flex-grow: 1;
          flex-shrink: 1;
          height: 0;
        `}
      >
        {children}
      </main>
    </div>
  )
}

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
