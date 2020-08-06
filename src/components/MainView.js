import React from 'react'
import PropTypes from 'prop-types'
import { Connect } from '@aragon/connect-react'
import Header from './Header/Header'

function MainView({ children }) {
  return (
    <Connect
      location="agreement3.aragonid.eth"
      connector="thegraph"
      options={{ network: 4 }}
    >
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
    </Connect>
  )
}

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
