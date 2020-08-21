import React from 'react'
import { GU, textStyle, useLayout } from '@aragon/ui'
import headerLogoSvg from '../../assets/aragonNetworkLogo.svg'

function HeaderLogo() {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img alt="" src={headerLogoSvg} width={4 * GU} />
      {!compactMode && (
        <h1
          css={`
            ${textStyle('body1')};
            line-height: 1;
            margin-left: ${1 * GU}px;
          `}
        >
          Aragon Network
        </h1>
      )}
    </div>
  )
}

export default HeaderLogo
