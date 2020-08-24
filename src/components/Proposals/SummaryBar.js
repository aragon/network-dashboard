import React from 'react'
import PropTypes from 'prop-types'
import { RADIUS, useTheme } from '@aragon/ui'
import { animated } from 'react-spring'
import styled from 'styled-components'

function SummaryBar({
  disabled,
  positiveSize,
  negativeSize,
  requiredSize,
  ...props
}) {
  const theme = useTheme()

  return (
    <Main {...props}>
      <CombinedBar>
        {!!positiveSize && (
          <BarPart
            style={{
              backgroundColor: `${
                disabled ? theme.surfaceOpened : theme.positive
              }`,
              transform: `scale3d(${positiveSize}, 1, 1)`,
            }}
          />
        )}
        {!!negativeSize && (
          <BarPart
            style={{
              backgroundColor: `${
                disabled ? theme.controlUnder : theme.negative
              }`,
              transform: `translate3d(${
                100 * positiveSize
              }%, 0, 0) scale3d(${negativeSize}, 1, 1)`,
            }}
          />
        )}
      </CombinedBar>
      <RequiredSeparatorClip>
        <RequiredSeparatorWrapper
          style={{
            transform: `scale3d(1, ${
              requiredSize > 0 ? 1 : 0
            }, 1) translate3d(${100 * requiredSize}%, 0, 0)`,
          }}
        >
          <div
            css={`
              height: 100%;
              border-left: 1px dashed ${theme.surfaceContent};
            `}
          />
        </RequiredSeparatorWrapper>
      </RequiredSeparatorClip>
    </Main>
  )
}

SummaryBar.defaultProps = {
  positiveSize: 0,
  negativeSize: 0,
  requiredSize: 0,
}

const Main = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 25px;
`

const CombinedBar = (props) => {
  const theme = useTheme()
  return (
    <div
      css={`
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 6px;
        border-radius: ${RADIUS}px;
        background: ${theme.surfaceUnder};
      `}
      {...props}
    />
  )
}

const BarPart = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px;
  transform-origin: 0 0;
`

const RequiredSeparatorClip = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const RequiredSeparatorWrapper = styled(animated.div)`
  height: 100%;
`

SummaryBar.propTypes = {
  disabled: PropTypes.bool,
  positiveSize: PropTypes.number,
  negativeSize: PropTypes.number,
  requiredSize: PropTypes.number,
}

export default SummaryBar
