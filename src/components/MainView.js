import React from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'
import { ScrollView } from '@aragon/ui'
import AppLoader from '../components/AppLoader/AppLoader'
import Header from './Header/Header'
import { useAppData } from '../providers/AppData'
import { useOrgApps } from '../providers/OrgApps'

const AnimatedDiv = animated.div

const MainView = React.memo(function MainView({ children }) {
  const { dataLoading } = useAppData()
  const { appsLoading } = useOrgApps()

  const loading = dataLoading || appsLoading

  const loaderExitTransitions = useTransition(loading, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <div
      css={`
        display: flex;
        position: relative;
        height: 100vh;
      `}
    >
      {!loading && (
        <div
          css={`
            display: flex;
            flex-direction: column;

            flex: 1;
            z-index: 1;
          `}
        >
          <Header
            css={`
              position: relative;
              z-index: 1;
              flex-shrink: 0;
            `}
          />

          <ScrollView
            css={`
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              flex-shrink: 1;
              height: 0;

              /* Always show scroll area to prevent visual jump when pages move between overflow */
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
      )}

      {loaderExitTransitions.map(
        ({ item: loading, key, props }) =>
          loading && (
            <AnimatedDiv
              style={props}
              key={key}
              css={`
                display: flex;
                position: absolute;

                top: 0;
                left: 0;
                bottom: 0;
                right: 0;

                z-index: 2;
              `}
            >
              <AppLoader
                css={`
                  flex: 1;
                `}
              />
            </AnimatedDiv>
          )
      )}
    </div>
  )
})

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
