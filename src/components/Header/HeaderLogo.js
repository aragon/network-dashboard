import React from 'react'
import { textStyle, useLayout, unselectable, useTheme, GU } from '@aragon/ui'
import headerLogoSvg from '../../assets/aragonNetworkLogo.svg'

function HeaderLogo() {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  return (
    <div
      css={`
        ${unselectable};
        display: flex;
        align-items: center;
      `}
    >
      <img alt="" src={headerLogoSvg} width={4 * GU} />
      {!compactMode && (
        <h1
          css={`
            line-height: 1;
            margin-left: ${1 * GU}px;
            color: ${theme.surfaceContent};

            ${textStyle('body1')};
          `}
        >
          Aragon Network
        </h1>
      )}
    </div>
  )
}

export default HeaderLogo
