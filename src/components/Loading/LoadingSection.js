import React from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring/renderprops'
import styled from 'styled-components'
import { Box, textStyle, LoadingRing, GU } from '@aragon/ui'
import loadingGraphic from '../../assets/loading.svg'
import { springs } from '../../style/springs'

const AnimatedDiv = styled(animated.div)`
  top: 0;
  left: 0;
  width: 100%;
`

function LoadingSection({ children, loading, title }) {
  return (
    <div
      css={`
        position: relative;
      `}
    >
      <Transition
        items={loading}
        config={springs.gentle}
        from={{ opacity: 0, transform: `translate3d(0, ${0.5 * GU}px, 0)` }}
        enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
        leave={{
          opacity: 0,
          position: 'absolute',
          transform: `translate3d(0, -${0.5 * GU}px, 0)`,
        }}
      >
        {(loading) =>
          loading
            ? (props) => (
                <AnimatedDiv style={props}>
                  <Box>
                    <div
                      css={`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding-top: ${11 * GU}px;
                        padding-bottom: ${11 * GU}px;
                      `}
                    >
                      <div
                        css={`
                          max-width: 100%;
                          width: ${34 * GU}px;
                        `}
                      >
                        <div
                          css={`
                            position: relative;

                            /* Match aspect ratio of loading graphic to reserve space during initial load */
                            padding-top: 58.5%;
                          `}
                        >
                          <img
                            src={loadingGraphic}
                            alt=""
                            css={`
                              display: block;
                              position: absolute;
                              top: 0;
                              left: 0;
                              width: 100%;
                            `}
                          />
                        </div>
                      </div>

                      <span
                        css={`
                          display: flex;
                          align-items: center;
                          margin-top: ${4 * GU}px;
                        `}
                      >
                        <div
                          css={`
                            margin-right: 16px;
                          `}
                        >
                          <LoadingRing mode="half-circle" />
                        </div>
                        <h2
                          css={`
                            ${textStyle('title3')}
                            line-height: 1.2;
                          `}
                        >
                          {title}…
                        </h2>
                      </span>
                    </div>
                  </Box>
                </AnimatedDiv>
              )
            : (props) => <AnimatedDiv style={props}>{children}</AnimatedDiv>
        }
      </Transition>
    </div>
  )
}

LoadingSection.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  title: PropTypes.string,
}

LoadingSection.defaultProps = {
  title: 'Loading',
}

export default LoadingSection
