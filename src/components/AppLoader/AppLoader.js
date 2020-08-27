import React from 'react'
import { useSpring, animated } from 'react-spring'
import { keyframes, css } from 'styled-components'
import { useTheme, GU } from '@aragon/ui'
import AppLoaderMark from './AppLoaderMark'

const AnimatedDiv = animated.div

const ringSpinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 0.75s linear infinite;
`

function AppLoader({ ...props }) {
  const theme = useTheme()

  const ringTransitionIn = useSpring({
    config: { mass: 1, tension: 200, friction: 20 },
    from: { opacity: 0, transform: `scale3d(1.5, 1.5, 1)` },
    to: { opacity: 1, transform: `scale3d(1, 1, 1)` },
  })

  return (
    <div
      css={`
        display: flex;

        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        background: linear-gradient(
          135deg,
          ${theme.accentEnd} 30%,
          ${theme.accentStart} 100%
        );
      `}
      {...props}
    >
      <AnimatedDiv
        css={`
          display: flex;
          position: relative;

          width: ${11 * GU}px;
          height: ${11 * GU}px;
        `}
        style={ringTransitionIn}
      >
        <AppLoaderMark />

        <div
          css={`
            position: absolute;

            /* Pull outside of bounding element to create visual space */
            top: -${1.5 * GU}px;
            left: -${1.5 * GU}px;
            right: -${1.5 * GU}px;
            bottom: -${1.5 * GU}px;

            border-radius: 100%;
            border: 3px solid white;

            ${ringSpinAnimation}
          `}
        />
      </AnimatedDiv>
    </div>
  )
}

export default AppLoader
