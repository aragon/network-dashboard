import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import { getNetworkName } from '../../lib/web3-utils'
import { networkEnvironment } from '../../current-environment'

function ProposalNotFoundError({ proposalId }) {
  const theme = useTheme()

  return (
    <>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${0.75 * GU}px;
          text-align: center;
        `}
      >
        Proposal not found
      </h1>
      <p
        css={`
          margin-bottom: ${4 * GU}px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          max-width: ${45 * GU}px;
          ${textStyle('body2')};
        `}
      >
        It looks like proposal{' '}
        <strong
          css={`
            color: ${theme.surfaceContent};
          `}
        >
          #{proposalId}
        </strong>{' '}
        doesn't exist on the {getNetworkName(networkEnvironment.chainId)}{' '}
        network!
      </p>
      <div
        css={`
          display: flex;
          justify-content: space-around;
        `}
      >
        <Button
          mode="strong"
          wide
          label="Go back to dashboard"
          onClick={() => (window.location.href = '/')}
        />
      </div>
    </>
  )
}

ProposalNotFoundError.propTypes = {
  proposalId: PropTypes.string,
}

export default ProposalNotFoundError
