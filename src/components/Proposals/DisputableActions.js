import React from 'react'
import { Button, GU } from '@aragon/ui'
import {
  VOTE_STATUS_PAUSED,
  VOTE_STATUS_ACTIVE,
} from '../../utils/disputable-vote-statuses'
import { addressesEqual } from '../../utils/web3-utils'

function DisputableActions({ status, submitter }) {
  //TODO: get connected account
  const connectedAccount = ''
  const connectedAccountIsSubmitter = addressesEqual(
    submitter,
    connectedAccount
  )

  //TODO: add claim collateral action validation

  if (status === VOTE_STATUS_PAUSED && connectedAccountIsSubmitter) {
    return (
      <React.Fragment>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          mode="strong"
          wide
          label="Accept settlement"
        />
        <Button mode="normal" wide label="Raise dispute to court" />
      </React.Fragment>
    )
  }
  if (status === VOTE_STATUS_ACTIVE) {
    return connectedAccountIsSubmitter ? (
      <Button mode="strong" wide label="Cancel vote" />
    ) : (
      <Button mode="strong" wide label="Challenge vote" />
    )
  }
  return <Button mode="strong" wide label="Review details" />
}

export default DisputableActions
