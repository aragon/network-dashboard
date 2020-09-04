import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonBase,
  Link,
  GU,
  IconDown,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'

const SUPPORT_URL = 'https://github.com/aragon/network-dashboard/issues/new'

const GenericError = React.memo(function GenericError({
  detailsTitle,
  detailsContent,
  reportCallback,
}) {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const toggle = useCallback(() => {
    setOpened(!opened)
  }, [opened, setOpened])

  return (
    <>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1 * GU}px;
          text-align: center;
        `}
      >
        An unexpected error has occurred
      </h1>
      <p
        css={`
          margin-bottom: ${5 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        Something went wrong! You can reload the app, or you can{' '}
        <Link href={SUPPORT_URL}>tell us what went wrong</Link> if the problem
        persists
      </p>
      {(detailsTitle || detailsContent) && (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: ${3 * GU}px;
          `}
        >
          <ButtonBase
            onClick={toggle}
            css={`
              display: flex;
              text-align-items: center;
              color: ${theme.surfaceContentSecondary};
              margin-bottom: ${1 * GU}px;
              ${textStyle('label2')};
            `}
          >
            Click here to see more details
            <IconDown
              size="tiny"
              css={`
                margin-left: ${0.5 * GU}px;
                transition: transform 150ms ease-in-out;
                transform: rotate3d(0, 0, 1, ${opened ? 180 : 0}deg);
              `}
            />
          </ButtonBase>
          {opened && (
            <div
              css={`
                border-radius: ${RADIUS}px;
                overflow: hidden;
                border: 1px solid ${theme.border};
                width: 100%;
              `}
            >
              <div
                css={`
                  padding: ${2 * GU}px;
                  color: ${theme.surfaceContent};
                  white-space: pre;
                  background-color: ${theme.surfaceUnder};
                  max-height: 200px;
                  overflow: auto;
                  ${textStyle('body3')};
                `}
              >
                {detailsTitle && (
                  <h2
                    css={`
                      ${textStyle('body2')};
                      margin-bottom: ${1.5 * GU}px;
                    `}
                  >
                    {detailsTitle}
                  </h2>
                )}
                <p
                  css={`
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  {detailsContent}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        css={`
          display: grid;
          grid-gap: ${1 * GU}px;
          grid-template-columns: auto auto;
        `}
      >
        <Button onClick={reportCallback}>Send Report</Button>

        <Button mode="strong" onClick={() => window.location.reload(true)}>
          Reload
        </Button>
      </div>
    </>
  )
})

GenericError.propTypes = {
  detailsTitle: PropTypes.node,
  detailsContent: PropTypes.node,
  reportCallback: PropTypes.func,
}

export default GenericError
