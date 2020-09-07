import React from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring/renderprops'
import { ScrollView, GU } from '@aragon/ui'
import LoadingFullscreen from '../components/Loading/LoadingFullscreen'
import Header from './Header/Header'
import { useOrgApps } from '../providers/OrgApps'

const AnimatedDiv = animated.div

const MainView = React.memo(function MainView({ children }) {
  const { loading } = useOrgApps()

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
                padding-bottom: ${12 * GU}px;
              `}
            >
              {!loading && children}
            </main>
          </ScrollView>
        </div>
      )}

      <Transition
        items={loading}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {(loading) =>
          loading &&
          ((props) => (
            <AnimatedDiv
              style={props}
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
              <LoadingFullscreen
                css={`
                  flex: 1;
                `}
              />
            </AnimatedDiv>
          ))
        }
      </Transition>
    </div>
  )
})

MainView.propTypes = {
  children: PropTypes.node,
}

export default MainView
