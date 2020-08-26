import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView } from '@aragon/ui'
import Header from './Header/Header'
import { useAppData } from '../providers/AppData'
import { useOrgApps } from '../providers/OrgApps'

const MainView = React.memo(function MainView({ children }) {
  const { dataLoading } = useAppData()
  const { appsLoading } = useOrgApps()

  const loading = dataLoading || appsLoading

  if (loading) {
    return (
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
        `}
      >
        Loading
      </div>
    )
  }

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
          z-index: 2;
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

          /* Always show scroll area to prevent visual jumps when pages move between overflow */
          overflow-y: scroll;
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
