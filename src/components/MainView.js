import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView } from '@aragon/ui'
import Header from './Header/Header'
import Banner from './Header/Banner'

const MainView = React.memo(function MainView({ children }) {
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
        <Banner />
      </div>
      <ScrollView
        css={`
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          flex-shrink: 1;
          height: 0;
        `}
      >
        <main
          css={`
            flex: 1;
          `}
        >
          {children}
        </main>
      </ScrollView>
    </div>
  )
})

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
