import React from 'react'
import PropTypes from 'prop-types'
import { Layout, ScrollView, useViewport } from '@aragon/ui'
import Header from './Header/Header'

function MainView({ children }) {
  const { width: vw } = useViewport()
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
          <Layout parentWidth={vw} paddingBottom={100}>
            {children}
          </Layout>
        </main>
        <footer>footer</footer>
      </ScrollView>
    </div>
  )
}

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
