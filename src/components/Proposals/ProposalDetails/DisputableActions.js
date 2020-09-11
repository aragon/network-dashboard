import React from 'react'
import PropTypes from 'prop-types'
import { Button, noop, GU } from '@aragon/ui'
import {
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_SCHEDULED,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_SETTLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_EXECUTED,
  VOTE_STATUS_CHALLENGED,
  VOTE_STATUS_REJECTED,
} from '../disputable-vote-statuses'
import { addressesEqual } from '../../../lib/web3-utils'
import { useWallet } from '../../../providers/Wallet'

function DisputableActions({ status, submitter, onChallenge }) {
  const { account } = useWallet()

  const connectedAccountIsSubmitter = addressesEqual(submitter, account)

  // TODO: add claim collateral action validation
  if (status === VOTE_STATUS_CHALLENGED && connectedAccountIsSubmitter) {
    return (
      <>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          mode="strong"
          disabled
          wide
          label="Accept settlement"
        />
        <Button mode="normal" disabled wide label="Raise dispute to court" />
      </>
    )
  }
  if (status === VOTE_STATUS_SCHEDULED) {
    return connectedAccountIsSubmitter ? (
      <Button mode="strong" disabled wide label="Cancel proposal" />
    ) : (
      <>
        <Button
          mode="strong"
          label="Challenge proposal"
          wide
          disabled={!account}
          onClick={onChallenge}
          css={`
            margin-bottom: ${1 * GU}px;
          `}
        />
        <Button mode="strong" disabled wide label="Review details" />
      </>
    )
  }
  return <Button mode="strong" disabled wide label="Review details" />
}

DisputableActions.propTypes = {
  status: PropTypes.oneOf([
    VOTE_STATUS_ACCEPTED,
    VOTE_STATUS_SCHEDULED,
    VOTE_STATUS_CANCELLED,
    VOTE_STATUS_SETTLED,
    VOTE_STATUS_DISPUTED,
    VOTE_STATUS_EXECUTED,
    VOTE_STATUS_CHALLENGED,
    VOTE_STATUS_REJECTED,
  ]),
  submitter: PropTypes.string,
  onChallenge: PropTypes.func,
}

DisputableActions.defaultProps = {
  onChallenge: noop,
}

export default DisputableActions
