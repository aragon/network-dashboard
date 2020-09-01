import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  GU,
  IconCross,
  Link,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import pcBanner from '../../assets/pc-banner.svg'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'

function ProposalBanner({ onCloseBanner, ...props }) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode =
    layoutName === 'medium' || layoutName === 'small' || layoutName === 'min'

  return (
    <div
      css={`
        background: linear-gradient(241.18deg, #ffb36d 6.22%, #ff8888 95.3%);
        width: 100%;
        background-size: cover;
        padding-top: ${4 * GU}px;
        padding-bottom: ${8 * GU}px;
      `}
      {...props}
    >
      <LayoutGutter collapseWhenSmall={false}>
        <LayoutLimiter>
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
                color: ${theme.surface};
              `}
            />
          </ButtonIcon>
          <div
            css={`
              display: flex;
              flex-direction: ${compactMode ? `column` : `row`};
              align-items: center;
              justify-content: space-around;
            `}
          >
            <div>
              <h1
                css={`
                color: ${theme.surface};
                ${textStyle('title4')}
                font-size: ${compactMode ? 6.5 * GU : 7.75 * GU}px;
                line-height: 1.1;
                font-weight: 700;
                margin-bottom: ${2.5 * GU}px;
                max-width: ${62 * GU}px;
              `}
              >
                This is a test organization
              </h1>
              <div
                css={`
                  ${textStyle('title4')};
                  font-size: ${compactMode ? 2.5 * GU : 2.75 * GU}px;
                  max-width: ${62 * GU}px;
                  color: ${theme.surface};
                `}
              >
                Aragon Network Cash is a test organization set up as part of a
                new round of precedence campaign disputes. Learn more on the{' '}
                <Link
                  href="https://aragon.org/blog/juror-dispute-guide-aragon-network-cash"
                  css={`
                    color: ${theme.surface};
                  `}
                >
                  Aragon project blog
                </Link>
                .
              </div>
            </div>

            <img
              src={pcBanner}
              css={`
                max-width: 70%;
                margin-top: ${compactMode ? `${4 * GU}px` : auto};
              `}
            />
          </div>
        </LayoutLimiter>
      </LayoutGutter>
    </div>
  )
}

ProposalBanner.propTypes = {
  onCloseBanner: PropTypes.func.isRequired,
}

export default ProposalBanner
