import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spring, Transition, animated } from 'react-spring/renderprops'
import {
  Modal,
  noop,
  Viewport,
  springs,
  textStyle,
  useViewport,
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
  const { currentScreen } = useMultiModal()
  const { disableClose, width: currentScreenWidth } = currentScreen

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
                  closeButton={!disableClose}
                  css={`
                    z-index: 2;
                  `}
                >
                  <ModalContent
                    onClose={onClose}
                    viewportWidth={viewportWidth}
                  />
                </Modal>
              )
            }}
          </Spring>
        )
      }}
    </Viewport>
  )
}

function ModalContent({ viewportWidth }) {
  const { step, direction, getScreen } = useMultiModal()

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
      const { title, content } = screen

      return (
        <>
          <h1
            css={`
              ${smallMode ? textStyle('title4') : textStyle('title3')};

              margin-top: -${1 * GU}px;
              margin-bottom: ${2 * GU}px;
            `}
          >
            {title}
          </h1>
          {content}
        </>
      )
    },
    [smallMode]
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
              transform: `translate3d(${2 * GU * direction}px, 0, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              opacity: 0,
              transform: `translate3d(${2 * GU * -direction}px, 0, 0)`,
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
                        // For better performance we avoid reflows between screen changes by matching the screen width with the modal width
                        width: Math.min(
                          viewportWidth,
                          stepScreen.width || DEFAULT_MODAL_WIDTH
                        ),
                        padding: smallMode ? 3 * GU : 5 * GU,
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
}
/* eslint-enable react/prop-types */

export default React.memo(MultiModal)
