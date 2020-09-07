import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spring, Transition, animated } from 'react-spring/renderprops'
import {
  IconCross,
  ButtonIcon,
  Modal,
  noop,
  Viewport,
  textStyle,
  useLayout,
  useTheme,
  GU,
} from '@aragon/ui'
import { useDisableAnimation } from '../../hooks/useDisableAnimation'
import { MultiModalProvider, useMultiModal } from './MultiModalProvider'
import { springs } from '../../style/springs'
import logoMarkOverlay from '../../assets/logo-mark-overlay.svg'

const DEFAULT_MODAL_WIDTH = 80 * GU
const AnimatedDiv = animated.div

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
      content: PropTypes.node,
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
            config={springs.tight}
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
                    {!disableClose && (
                      <ButtonIcon
                        label=""
                        css={`
                          position: absolute;
                          top: ${2.5 * GU}px;
                          right: ${2.5 * GU}px;

                          z-index: 2;
                        `}
                        onClick={handleModalClose}
                      >
                        <IconCross
                          css={`
                            color: ${graphicHeader
                              ? theme.overlay
                              : theme.surfaceContentSecondary};
                          `}
                        />
                      </ButtonIcon>
                    )}

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
  const { step, direction, getScreen } = useMultiModal()

  const [applyStaticHeight, setApplyStaticHeight] = useState(false)
  const [height, setHeight] = useState(null)
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const { layoutName } = useLayout()
  const smallMode = layoutName === 'small'

  const onStart = useCallback(() => {
    enableAnimation()

    if (!animationDisabled) {
      setApplyStaticHeight(true)
    }
  }, [animationDisabled, enableAnimation])

  const renderScreen = useCallback(
    (screen) => {
      const { title, content, graphicHeader, width } = screen

      const standardPadding = smallMode ? 3 * GU : 5 * GU

      return (
        <>
          {graphicHeader ? (
            <div
              css={`
                position: relative;
                overflow: hidden;
                padding: ${smallMode ? 5 * GU : 6.5 * GU}px ${standardPadding}px
                  ${smallMode ? 2 * GU : 2.5 * GU}px ${standardPadding}px;
                background: linear-gradient(
                  10deg,
                  ${theme.accentEnd} 0%,
                  ${theme.accentStart} 200%
                );

                margin-bottom: ${smallMode ? 2 * GU : 3 * GU}px;

                &::after {
                  content '';

                  position: absolute;

                  bottom: 0;
                  left: 0;

                  background-color: red;

                  width: 100%;
                  height: ${6 * GU}px;
                  background-color: red;

                  background: linear-gradient(
                  to top,
                  rgba(0,0,0,0.04) 0%,
                  rgba(0,0,0,0) 70%
                );
                }
              `}
            >
              <h1
                css={`
                  position: relative;
                  z-index: 1;
                  ${smallMode ? textStyle('title3') : textStyle('title2')};

                  font-weight: 600;
                  color: ${theme.overlay};
                `}
              >
                {title}
              </h1>
              <img
                alt=""
                src={logoMarkOverlay}
                css={`
                  position: absolute;

                  bottom: -${5 * GU}px;
                  left: ${2 * GU}px;

                  width: 130px;
                  height: 130px;
                  opacity: 0.3;
                `}
              />
            </div>
          ) : (
            <div
              css={`
                padding: ${smallMode ? 3 * GU : 5 * GU}px ${standardPadding}px
                  ${smallMode ? 1.5 * GU : 2.5 * GU}px ${standardPadding}px;
              `}
            >
              <h1
                css={`
                  ${smallMode ? textStyle('title3') : textStyle('title2')};

                  margin-top: -${0.5 * GU}px;
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
              padding: 0 ${standardPadding}px ${standardPadding}px
                ${standardPadding}px;
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
      config={springs.tight}
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
              state === 'leave' ? springs.instant : springs.tight
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
