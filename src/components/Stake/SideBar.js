import React from 'react'
import PropTypes from 'prop-types'
import { GU, textStyle, useTheme } from '@aragon/ui'
import CardAccordion from './CardAccordion'
import coin from './assets/coin.svg'
import wallet from './assets/wallet.svg'

function Sidebar() {
  return (
    <div
      css={`
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        grid-gap: ${2 * GU}px;
      `}
    >
      <CardAccordion
        content={
          <CardContent
            amount="72,243.47"
            icon={wallet}
            title="Available ANT"
            tokenAmount="11,278.04"
          />
        }
        expansion="I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. ANT holders in equal measure."
      />
      <CardAccordion
        content={
          <CardContent
            amount="40,319.701"
            icon={coin}
            title="Locked ANT"
            tokenAmount="6,684.60"
          />
        }
        expansion="I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. ANT holders in equal measure."
      />
      <CardAccordion
        content={
          <CardContent
            amount="-555.57"
            icon={coin}
            title="Slashed ANT"
            tokenAmount="83.39"
            negative
          />
        }
        expansion="I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. I'm disputing this proposal because I believe that it was not made in good faith and will not benefit all ANT holders in equal measure. ANT holders in equal measure."
      />
    </div>
  )
}

function CardContent({ icon, title, tokenAmount, amount, negative }) {
  const theme = useTheme()
  return (
    <div
      css={`
        text-align: center;
      `}
    >
      <img
        src={icon}
        width={6 * GU}
        height={6 * GU}
        css={`
          margin: auto;
        `}
      />
      <h2
        css={`
          ${textStyle('title4')};
        `}
      >
        {tokenAmount}
      </h2>
      <h1
        css={`
          margin: ${0.5 * GU}px 0;
        `}
      >
        {title}
      </h1>
      <p
        css={`
          color: ${negative ? theme.negative : theme.positive};
        `}
      >
        $ {amount}
      </p>
    </div>
  )
}

CardContent.propTypes = {
  icon: PropTypes.node,
  tokenAmount: PropTypes.string,
  amount: PropTypes.string,
  title: PropTypes.string,
  negative: PropTypes.bool,
}

export default Sidebar
