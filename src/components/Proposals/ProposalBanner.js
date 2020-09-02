import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  IconCross,
  Link,
  textStyle,
  useLayout,
  useTheme,
  GU,
} from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import pcSvgBanner from '../../assets/pc-banner.svg'

function ProposalBanner({ onCloseBanner, ...props }) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const wideMode = layoutName === 'large' || layoutName === 'max'

  return (
    <LayoutGutter
      collapseWhenSmall={false}
      css={`
        background: linear-gradient(241.18deg, #ffb36d 6.22%, #ff8888 95.3%);
        padding-top: ${7 * GU}px;
        padding-bottom: ${7 * GU}px;
        position: relative;
      `}
      {...props}
    >
      <ButtonIcon
        label=""
        css={`
          position: absolute;
          top: ${wideMode ? 4 * GU : 2 * GU}px;
          right: ${wideMode ? 3.5 * GU : 2 * GU}px;
        `}
        onClick={onCloseBanner}
      >
        <IconCross
          css={`
            color: ${theme.surface};
          `}
        />
      </ButtonIcon>
      <LayoutLimiter>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 ${wideMode ? '5%' : '0'};
          `}
        >
          <div>
            <h1
              css={`
                margin-bottom: ${2.5 * GU}px;
                max-width: ${62 * GU}px;

                ${textStyle('title4')}
                color: ${theme.overlay};
                font-size: ${wideMode ? '62px' : '52px'};
                line-height: 1.05;
                font-weight: 700;
              `}
            >
              This is a test organization
            </h1>
            <p
              css={`
                ${textStyle('title4')};
                font-size: ${wideMode ? 2.75 * GU : 2.5 * GU}px;
                max-width: ${62 * GU}px;
                color: ${theme.overlay};
              `}
            >
              Aragon Network Cash is a test organization set up as part of a new
              round of precedence campaign disputes. Learn more on the{' '}
              <Link
                href="https://aragon.org/blog/juror-dispute-guide-aragon-network-cash"
                css={`
                  color: ${theme.overlay};
                `}
              >
                Aragon project blog
              </Link>
              .
            </p>
          </div>
          {wideMode && (
            <img
              src={pcSvgBanner}
              css={`
                width: 472px;
                height: 401px;
                margin-top: ${-3 * GU}px;
                margin-right: ${3 * GU}px;
              `}
            />
          )}
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

ProposalBanner.propTypes = {
  onCloseBanner: PropTypes.func.isRequired,
}

export default ProposalBanner
