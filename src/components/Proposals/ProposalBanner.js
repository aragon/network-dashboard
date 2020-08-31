import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCross,
  textStyle,
  useTheme,
} from '@aragon/ui'
import background from '../../assets/banner.svg'
import LayoutGutter from '../Layout/LayoutGutter'

function ProposalBanner({ onCloseBanner, ...props }) {
  // TODO: Integrate it with the layout once is merged & Make it responsive
  const theme = useTheme()

  return (
    <div
      css={`
        background-image: url(${background});
        background-position: 20% center;
        width: 100%;
        background-size: cover;
        text-align: center;
        padding-top: ${13 * GU}px;
        padding-bottom: ${15 * GU}px;
      `}
      {...props}
    >
      <LayoutGutter collapseWhenSmall={false}>
        <ButtonIcon
          label=""
          css={`
            position: absolute;
            top: ${4 * GU}px;
            right: ${4 * GU}px;
          `}
          onClick={onCloseBanner}
        >
          <IconCross
            css={`
              color: ${theme.surfaceOpened};
            `}
          />
        </ButtonIcon>

        <h1
          css={`
            background: linear-gradient(to bottom, ${theme.accentStart} -50%,${
            theme.accentEnd
          } 60%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            ${textStyle('title4')}
            font-size: ${6.5 * GU}px;
            line-height: 1.1;
            font-weight: 700;
            margin-bottom: ${1.5 * GU}px;
          `}
        >
          Fight For Freedom
        </h1>
        <p
          css={`
            ${textStyle('body1')};
            max-width: ${95 * GU}px;
            margin: auto;
            margin-bottom: ${3.5 * GU}px;
            color: ${theme.contentSecondary};
          `}
        >
          We believe humankind should use technology as a liberating tool to
          unleash all the goodwill and creativity of our species, rather than as
          a tool to enslave and take advantage of one another.
        </p>
        <Button
          label="Read Aragon Manifesto"
          mode="strong"
          href="https://aragon.org/manifesto"
          css={`
            padding: ${2.75 * GU}px ${3.5 * GU}px;
            font-weight: 600;
          `}
        />
      </LayoutGutter>
    </div>
  )
}

ProposalBanner.propTypes = {
  onCloseBanner: PropTypes.func.isRequired,
}

export default ProposalBanner
