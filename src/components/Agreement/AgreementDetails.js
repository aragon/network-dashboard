import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge, Link, useLayout, GU } from '@aragon/ui'
import { dateFormat } from '../../utils/date-utils'
import InfoField from '../InfoField'
import { getIpfsCidFromUri, getIpfsUrlFromUri } from '../../lib/ipfs-utils'
import { networkEnvironment } from '../../current-environment'

function AgreementDetails({
  creationDate,
  contractAddress,
  ipfsUri,
  stakingAddress,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <InfoField label="Agreement IPFS Link">
          <Link
            href={getIpfsUrlFromUri(ipfsUri)}
            css={`
              max-width: 90%;
            `}
          >
            <span
              css={`
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
              `}
            >
              {getIpfsCidFromUri(ipfsUri)}
            </span>
          </Link>
        </InfoField>
      </div>
      <div
        css={`
          display: grid;
          grid-gap: ${compactMode ? 3 * GU : 4 * GU}px;
          grid-auto-flow: ${compactMode ? 'row' : 'column'};
        `}
      >
        <InfoField label="Arbitrator">
          <Link href={networkEnvironment.courtUrl}>Aragon Court</Link>
        </InfoField>
        <InfoField label="Staking Pool">
          <IdentityBadge entity={stakingAddress} />
        </InfoField>
        <InfoField label="Agreement Contract">
          <IdentityBadge entity={contractAddress} />
        </InfoField>
        <InfoField label="Creation Date">{dateFormat(creationDate)}</InfoField>
      </div>
    </>
  )
}

AgreementDetails.propTypes = {
  contractAddress: PropTypes.string,
  creationDate: PropTypes.number,
  ipfsUri: PropTypes.string,
  stakingAddress: PropTypes.string,
}

export default AgreementDetails
