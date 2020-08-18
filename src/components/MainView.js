import React from 'react'
import PropTypes from 'prop-types'
import { Layout, ScrollView } from '@aragon/ui'
import Footer from './Footer'
import Header from './Header/Header'

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
          <Layout paddingBottom={0}>{children}</Layout>
        </main>
        <Footer />
      </ScrollView>
    </div>
  )
})

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
