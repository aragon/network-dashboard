import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spring, Transition, animated } from 'react-spring/renderprops'
import {
  IconCross,
  ButtonIcon,
  Modal,
  noop,
  Viewport,
  springs,
  textStyle,
  useViewport,
  useTheme,
  GU,
} from '@aragon/ui'
import { useDisableAnimation } from '../../hooks/useDisableAnimation'
import { MultiModalProvider, useMultiModal } from './MultiModalProvider'

const DEFAULT_MODAL_WIDTH = 80 * GU
const AnimatedDiv = animated.div

const spring = { mass: 0.75, tension: 600, friction: 40 }

function MultiModal({ visible, screens, onClose }) {
  const [render, setRender] = useState(visible)

  useEffect(() => {
    if (visible) {
      setRender(true)
    }
  }, [render, visible])

  const handleOnClosed = useCallback(() => {
    // Ensure react-spring has properly cleaned up state prior to unmount
    setTimeout(() => setRender(false))
  }, [setRender])

  return (
    <>
      {render && (
        <MultiModalProvider screens={screens}>
          <MultiModalFrame
            visible={visible}
            onClose={onClose}
            onClosed={handleOnClosed}
          />
        </MultiModalProvider>
      )}
    </>
  )
}

MultiModal.propTypes = {
  visible: PropTypes.bool,
  screens: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.func,
      disableClose: PropTypes.bool,
      width: PropTypes.number,
    })
  ).isRequired,
  onClose: PropTypes.func,
}

MultiModal.defaultProps = {
  onClose: noop,
}

/* eslint-disable react/prop-types */
function MultiModalFrame({ visible, onClose, onClosed }) {
  const theme = useTheme()
  const { currentScreen } = useMultiModal()
  const {
    disableClose,
    width: currentScreenWidth,
    graphicHeader,
  } = currentScreen

  const modalWidth = currentScreenWidth || DEFAULT_MODAL_WIDTH

  const handleModalClose = useCallback(() => {
    if (!disableClose) {
      onClose()
    }
  }, [disableClose, onClose])

  return (
    <Viewport>
      {({ width }) => {
        // Apply a small gutter when matching the viewport width
        const viewportWidth = width - 4 * GU

        return (
          <Spring
            config={spring}
            to={{ width: Math.min(viewportWidth, modalWidth) }}
          >
            {({ width }) => {
              return (
                <Modal
                  padding={0}
                  width={width}
                  onClose={handleModalClose}
                  onClosed={onClosed}
                  visible={visible}
                  closeButton={false}
                  css={`
                    z-index: 2;
                  `}
                >
                  <div
                    css={`
                      position: relative;
                    `}
                  >
                    <ButtonIcon
                      label=""
                      css={`
                        position: absolute;
                        top: 30px;
                        right: 30px;

                        z-index: 2;
                      `}
                      onClick={handleModalClose}
                    >
                      <IconCross
                        css={`
                          color: ${graphicHeader ? 'red' : 'blue'};
                        `}
                      />
                    </ButtonIcon>
                    <ModalContent
                      onClose={onClose}
                      viewportWidth={viewportWidth}
                    />
                  </div>
                </Modal>
              )
            }}
          </Spring>
        )
      }}
    </Viewport>
  )
}

const ModalContent = React.memo(function ModalContent({ viewportWidth }) {
  const theme = useTheme()
  const { step, direction, getScreen, currentScreen } = useMultiModal()

  const [applyStaticHeight, setApplyStaticHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const { below } = useViewport()
  const smallMode = below('medium')

  const onStart = useCallback(() => {
    enableAnimation()

    if (!animationDisabled) {
      setApplyStaticHeight(true)
    }
  }, [animationDisabled, enableAnimation])

  const renderScreen = useCallback(
    (screen) => {
      const { title, content, graphicHeader, width } = screen

      const paddingX = smallMode ? 3 * GU : 5 * GU

      return (
        <>
          {graphicHeader ? (
            <div
              css={`
                padding: ${paddingX}px ${paddingX}px 0 ${paddingX}px;
                background: linear-gradient(
                  10deg,
                  ${theme.accentEnd} 0%,
                  ${theme.accentStart} 150%
                );
              `}
            >
              <h1
                css={`
                  ${smallMode ? textStyle('title4') : textStyle('title3')};

                  font-weight: 600;

                  margin-top: -${1 * GU}px;

                  color: ${theme.overlay};
                `}
              >
                {title}
              </h1>
            </div>
          ) : (
            <div
              css={`
                padding: ${smallMode ? 3 * GU : 5 * GU}px;
                padding-left: ${paddingX}px;
                padding-right: ${paddingX}px;

                padding-bottom: 0;
              `}
            >
              <h1
                css={`
                  ${smallMode ? textStyle('title4') : textStyle('title3')};

                  margin-top: -${1 * GU}px;
                  margin-bottom: ${2 * GU}px;
                `}
              >
                {title}
              </h1>
            </div>
          )}

          <div
            css={`
              /* For better performance we avoid reflowing long text between screen changes by matching the screen width with the modal width */
              width: ${Math.min(viewportWidth, width || DEFAULT_MODAL_WIDTH)}px;
              padding: 0 ${paddingX}px ${paddingX}px ${paddingX}px;
            `}
          >
            {content}
          </div>
        </>
      )
    },
    [smallMode, theme, viewportWidth]
  )

  return (
    <Spring
      config={spring}
      to={{ height }}
      immediate={animationDisabled}
      native
    >
      {({ height }) => (
        <AnimatedDiv
          style={{
            position: 'relative',
            height: applyStaticHeight ? height : 'auto',
          }}
        >
          <Transition
            config={(_, state) =>
              state === 'leave' ? springs.instant : spring
            }
            items={step}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${5 * GU * direction}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              opacity: 0,
              transform: `translate3d(0, ${5 * GU * -direction}px, 0)`,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            onRest={(_, status) => {
              if (status === 'update') {
                setApplyStaticHeight(false)
              }
            }}
            onStart={onStart}
            native
          >
            {(step) => (animProps) => {
              const stepScreen = getScreen(step)

              return (
                <>
                  {stepScreen && (
                    <AnimatedDiv
                      ref={(elt) => {
                        if (elt) {
                          setHeight(elt.clientHeight)
                        }
                      }}
                      style={{
                        width: '100%',
                        ...animProps,
                      }}
                    >
                      {renderScreen(stepScreen)}
                    </AnimatedDiv>
                  )}
                </>
              )
            }}
          </Transition>
        </AnimatedDiv>
      )}
    </Spring>
  )
})
/* eslint-enable react/prop-types */

export default React.memo(MultiModal)
