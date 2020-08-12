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
      <div
        css={`
          flex-grow: 1;
          flex-shrink: 1;
          height: 0;
        `}
      >
        <ScrollView>
          <div
            css={`
              display: flex;
              flex-direction: column;
              height: 100%;
            `}
          >
            <div
              css={`
                flex: 1 0 auto;
              `}
            >
              <Layout parentWidth={vw} paddingBottom={100}>
                {children}
              </Layout>
            </div>
            <footer>footer</footer>
          </div>
        </ScrollView>
      </div>
    </div>
  )
}

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
