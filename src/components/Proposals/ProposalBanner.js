import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconCross, textStyle, useTheme } from '@aragon/ui'
import background from '../../assets/banner.svg'

function ProposalBanner({ onCloseBanner }) {
  // TODO: Integrate it with the layout once is merged & Make it responsive

  const theme = useTheme()

  return (
    <div
      css={`
        background-image: url(${background});
        background-position: center;
        width: 100%;
        background-size: cover;
        text-align: center;
        padding: ${13 * GU}px 0 ${15 * GU}px 0;
        position: relative;
      `}
    >
      <IconCross
        onClick={onCloseBanner}
        css={`
          position: absolute;
          top: ${4 * GU}px;
          right: ${4 * GU}px;
          color: ${theme.surfaceOpened};
          cursor: pointer;
        `}
      />
      <div
        css={`
          max-width: 90vw;
          margin: auto;
        `}
      >
        <h1
          css={`
              ${textStyle('title4')}
              font-size: ${7 * GU}px;
              line-height: 125%;
              font-weight: 700;
              background: -webkit-linear-gradient(#32fff5, #01bfe3);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            `}
        >
          Fight For Freedom
        </h1>
        <p
          css={`
            ${textStyle('body1')};
            max-width: ${95 * GU}px;
            margin: auto;
            padding: ${3 * GU}px 0;
            color: ${theme.contentSecondary};
          `}
        >
          We believe humankind should use technology as a liberating tool to
          unleash all the goodwill and creativity of our species, rather than as
          a tool to enslave and take advantage of one another.
        </p>
        <Button
          label="Read Aragon Manifesto"
          href="https://aragon.org/manifesto"
        />
      </div>
    </div>
  )
}

ProposalBanner.propTypes = {
  onCloseBanner: PropTypes.func.isRequired,
}

export default ProposalBanner
