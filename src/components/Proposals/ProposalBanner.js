import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCross,
  Link,
  textStyle,
  useTheme,
} from '@aragon/ui'
import background from '../../assets/banner.svg'

function ProposalBanner({ onCloseBanner, ...props }) {
  const theme = useTheme()

  return (
    <div
      css={`
        background-image: url(${background});
        background-position: 20% center;
        width: 100%;
        background-size: cover;
        text-align: center;
        padding: ${13 * GU}px 0 ${15 * GU}px 0;
      `}
      {...props}
    >
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
      <div
        css={`
          max-width: 90vw;
          margin: auto;
        `}
      >
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
        <div
          css={`
            ${textStyle('body1')};
            max-width: ${95 * GU}px;
            margin: auto;
            margin-bottom: ${3.5 * GU}px;
            color: ${theme.contentSecondary};
          `}
        >
          This is a test - Aragon Network Cash is a test organization set up as
          part of a new round of precedence campaign disputes. Learn more on the{' '}
          <Link href="https://aragon.org/blog">Aragon project blog</Link>.
        </div>
        <div
          css={`
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
          `}
        >
          <Button
            label="Learn more"
            mode="strong"
            href="https://aragon.org/blog"
            css={`
              padding: ${2.75 * GU}px ${3.5 * GU}px;
              font-weight: 600;
              margin: ${0.5 * GU}px;
              width: 221px;
            `}
          />
          <Button
            label="Read Aragon Manifesto"
            mode="normal"
            href="https://aragon.org/manifesto"
            css={`
              padding: ${2.75 * GU}px ${3.5 * GU}px;
              font-weight: 600;
              margin: ${0.5 * GU}px;
            `}
          />
        </div>
      </div>
    </div>
  )
}

ProposalBanner.propTypes = {
  onCloseBanner: PropTypes.func.isRequired,
}

export default ProposalBanner
