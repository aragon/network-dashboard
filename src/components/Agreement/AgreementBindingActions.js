import React from 'react'
import styled from 'styled-components'
import { PropTypes } from 'prop-types'
import { Accordion, AppBadge, Box, TokenAmount, useTheme, GU } from '@aragon/ui'
import HelpTip from '../HelpTip'
import InfoField from './../InfoField'
import { durationToHours } from '../../utils/date-utils'

function AgreementBindingActions({ disputableApps }) {
  const items = disputableApps.map(
    ({
      appName,
      appAddress,
      iconSrc,
      actionAmount,
      challengeAmount,
      challengeDuration,
      token,
    }) => [
      <div
        css={`
          display: flex;
          align-items: center;
          margin-left: ${-1 * GU}px;
        `}
      >
        <AppBadge iconSrc={iconSrc} label={appName} appAddress={appAddress} />
      </div>,

      <div
        css={`
          display: inline-grid;
          width: 100%;
          padding-top: ${3 * GU}px;
          padding-bottom: ${3 * GU}px;
          padding-left: ${1.25 * GU}px;
          grid-auto-flow: row;
          grid-gap: ${3 * GU}px;
        `}
      >
        <InfoField
          label={
            <>
              Action Collateral
              <HelpTip type="action-collateral" />
            </>
          }
        >
          <AmountPerAction amount={actionAmount} token={token} />
        </InfoField>

        <InfoField
          label={
            <>
              Challenge Collateral
              <HelpTip type="challenge-collateral" />
            </>
          }
        >
          <AmountPerAction amount={challengeAmount} token={token} />
        </InfoField>

        <InfoField
          label={
            <>
              Settlement Period
              <HelpTip type="settlement-period" />
            </>
          }
        >
          {durationToHours(challengeDuration)} <SubtleLabel>Hours</SubtleLabel>
        </InfoField>
      </div>,
    ]
  )

  return (
    <Box heading="Binding Actions" padding={0}>
      <StyledAccordion>
        <Accordion items={items} />
      </StyledAccordion>
    </Box>
  )
}

/* eslint-disable react/prop-types */
function SubtleLabel({ children }) {
  const theme = useTheme()

  return (
    <span
      css={`
        color: ${theme.surfaceContentSecondary};
      `}
    >
      {children}
    </span>
  )
}

function AmountPerAction({ amount, token }) {
  const { id, decimals, symbol } = token

  return (
    <div
      css={`
        display: inline-flex;
      `}
    >
      <TokenAmount
        amount={amount}
        address={id}
        decimals={decimals}
        symbol={symbol}
        css={`
          margin-right: ${0.75 * GU}px;
        `}
      />{' '}
      <SubtleLabel>(per action)</SubtleLabel>
    </div>
  )
}
/* eslint-disable react/prop-types */

const StyledAccordion = styled.div`
  & > div:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }

  & > div:last-child {
    border-bottom: 0;
  }
`

AgreementBindingActions.propTypes = {
  disputableApps: PropTypes.array.isRequired,
}

export default AgreementBindingActions
