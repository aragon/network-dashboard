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
      <img
        alt=""
        src={headerLogoSvg}
        width={4 * GU}
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      {!compactMode && (
        <h1
          css={`
            display: flex;
            height: 100%;
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
