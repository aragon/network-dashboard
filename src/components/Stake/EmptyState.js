import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, textStyle, useLayout, useTheme } from '@aragon/ui'

export default function EmptyState({ icon, title, paragraph }) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <Box>
      <div
        css={`
          margin: ${(compactMode ? 0 : 9) * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={icon}
          alt=""
          css={`
            display: block;
            width: 100%;
            max-width: ${(compactMode ? 12 : 30) * GU}px;
            height: auto;
            margin: ${4 * GU}px 0;
          `}
        />

        <span
          css={`
            ${textStyle(compactMode ? 'title4' : 'title2')};
            text-align: center;
          `}
        >
          {title}
        </span>
        <div
          css={`
            ${textStyle('body2')};
            color: ${theme.surfaceContentSecondary};
            margin-top: ${1.5 * GU}px;
            width: ${(compactMode ? 25 : 55) * GU}px;
            display: flex;
            text-align: center;
          `}
        >
          {paragraph}
        </div>
      </div>
    </Box>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  paragraph: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.object,
  ]),
}
