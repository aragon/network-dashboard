import React, { useCallback, useState } from 'react'
import { Button, GU, IconCross, textStyle, useTheme } from '@aragon/ui'
import background from '../../assets/banner.svg'

function Banner() {
  const theme = useTheme()

  const [bannerClosed, setBannerClosed] = useState(
    localStorage.getItem('bannerClosed') === 'true'
  )

  const handleCloseBanner = useCallback(() => {
    localStorage.setItem('bannerClosed', 'true')
    setBannerClosed(true)
  }, [])

  return (
    <>
      {bannerClosed ? (
        <div />
      ) : (
        <div
          css={`
            background-image: url(${background});
            height: 414px;
            width: 100%;
            background-size: cover;
            text-align: center;
            padding: ${13 * GU}px 0 ${15 * GU}px 0;
            position: relative;
          `}
        >
          <IconCross
            onClick={handleCloseBanner}
            css={`
              position: absolute;
              top: ${4 * GU}px;
              right: ${4 * GU}px;
              color: ${theme.surfaceOpened};
              cursor: pointer;
            `}
          />

          <h1
            css={`
              font-size: ${7 * GU}px;
              line-height: ${8 * GU}px;
              font-weight: bold;
              background: -webkit-linear-gradient(162.88deg, #32fff5, #01bfe3);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            `}
          >
            Fight For Freedom
          </h1>
          <p
            css={`
              ${textStyle('body1')};
              font-weight: 300;
              max-width: 750px;
              margin: auto;
              padding: ${3 * GU}px 0;
              color: ${theme.contentSecondary};
            `}
          >
            We believe humankind should use technology as a liberating tool to
            unleash all the goodwill and creativity of our species, rather than
            as a tool to enslave and take advantage of one another.
          </p>
          <Button
            label="Read Aragon Manifesto"
            href="https://aragon.org/manifesto"
          />
        </div>
      )}
    </>
  )
}

export default Banner
