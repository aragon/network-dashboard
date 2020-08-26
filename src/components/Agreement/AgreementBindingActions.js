import React from 'react'
import styled from 'styled-components'
import { PropTypes } from 'prop-types'
import {
  Accordion,
  AppBadge,
  Box,
  Help,
  TokenAmount,
  useTheme,
  GU,
} from '@aragon/ui'
import InfoField from './../InfoField'

function AgreementBindingActions({ apps }) {
  const items = apps.map(
    ({
      appName,
      appAddress,
      actionCollateral,
      challengeCollateral,
      settlementPeriod,
    }) => [
      <div
        css={`
          display: flex;
          align-items: center;
          margin-left: ${-1 * GU}px;
        `}
      >
        <AppBadge label={appName} appAddress={appAddress} />
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
              <Help hint="What is Action Collateral?">
                The <strong>action collateral</strong> is the amount of
                collateral tokens required to be locked every time an action is
                created. This amount will be automatically locked from the
                staking pool balance given that access is granted to the
                Agreements app as the Lock Manager.
              </Help>
            </>
          }
        >
          <AmountPerAction
            address={actionCollateral.address}
            amount={actionCollateral.amount}
            decimals={actionCollateral.decimals}
            symbol={actionCollateral.symbol}
          />
        </InfoField>

        <InfoField
          label={
            <>
              Challenge Collateral
              <Help hint="What is Challenge Collateral?">
                The <strong>challenge collateral</strong> is the amount of
                collateral tokens required to be locked every time an action is
                challenged.
              </Help>
            </>
          }
        >
          <AmountPerAction
            address={challengeCollateral.address}
            amount={challengeCollateral.amount}
            decimals={challengeCollateral.decimals}
            symbol={challengeCollateral.symbol}
          />
        </InfoField>

        <InfoField
          label={
            <>
              Settlement Period
              <Help hint="What is Settlement Period?">
                The <strong>settlement period</strong> is the interval of time
                that starts when a disputable action is challenged and lasts
                until it’s resolved between the parties (submitter and
                challenger), by accepting the settlement offer or by raising the
                dispute to Aragon Court.
              </Help>
            </>
          }
        >
          {settlementPeriod} <SubtleLabel>Hours</SubtleLabel>
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

function AmountPerAction({ address, amount, decimals, symbol }) {
  return (
    <div
      css={`
        display: inline-flex;
      `}
    >
      <TokenAmount
        amount={amount}
        address={address}
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
  apps: PropTypes.array.isRequired,
}

export default AgreementBindingActions
