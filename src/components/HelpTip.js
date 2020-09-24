import React from 'react'
import PropTypes from 'prop-types'
import { Help } from '@aragon/ui'

const KNOWN_HELP_DESCRIPTIONS = {
  'support-percentage': [
    'Action Collateral',
    <>
      <strong>Support</strong> is the relative percentage of tokens that are
      required to vote “Yes” for a proposal to be approved. For example, if
      “Support” is set to 50%, then more than 50% of the tokens used to vote on
      a proposal must vote “Yes” for it to pass.
    </>,
  ],
  'minimum-approval': [
    'Minimum Approval',
    <>
      <strong>Minimum Approval</strong> is the percentage of the total token
      supply that is required to vote “Yes” on a proposal before it can be
      approved. For example, if the “Minimum Approval” is set to 20%, then more
      than 20% of the outstanding token supply must vote “Yes” on a proposal for
      it to pass.
    </>,
  ],
  'challenge-collateral': [
    'Challenge Collateral',
    <>
      <strong>Challenge Collateral</strong> is the amount of collateral tokens
      required to be locked every time an action is challenged.
    </>,
  ],
  'action-collateral': [
    'Action Collateral',
    <>
      <strong>Action Collateral</strong> is the amount of collateral tokens
      required to be locked every time an action is created. This amount will be
      automatically locked from the staking pool balance given that access is
      granted to the Agreements app as the Lock Manager.
    </>,
  ],
  'settlement-period': [
    'Minimum Approval',
    <>
      The <strong>Settlement Period</strong> is the interval of time that starts
      when a disputable action is challenged and lasts until it’s resolved
      between the parties (submitter and challenger), by accepting the
      settlement offer or by raising the dispute to Aragon Court.
    </>,
  ],
  'settlement-offer': [
    'Settlement Offer',
    <>
      The <strong>Settlement Offer</strong> is the amount of tokens that the
      challenger offers to the proposal submitter in an attempt to cancel the
      action and resolve the challenge without having to raise it to Aragon
      Court. This amount cannot be greater than the collateral locked for the
      action but can be zero.
    </>,
  ],
}

function HelpTip({ type }) {
  const [name, description] = KNOWN_HELP_DESCRIPTIONS[type]

  return <Help hint={`What is ${name}?`}>{description}</Help>
}

HelpTip.propTypes = {
  type: PropTypes.oneOf([
    'support-percentage',
    'minimum-approval',
    'challenge-collateral',
    'action-collateral',
    'settlement-period',
  ]).isRequired,
}

export default HelpTip
