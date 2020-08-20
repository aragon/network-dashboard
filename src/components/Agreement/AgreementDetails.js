import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge, Link, useLayout, GU } from '@aragon/ui'
import InfoField from '../InfoField'
import { getIpfsCidFromUri, getIpfsUrlfromUri } from '../../lib/ipfs-utils'

function AgreementDetails({ ipfsUri, contractAddress, creationDate }) {
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
            href={getIpfsUrlfromUri(ipfsUri)}
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
          <Link href="https://court.aragon.org/">Aragon Court</Link>
        </InfoField>
        <InfoField label="Staking Pool">
          <Link href="">Stake Management</Link>
        </InfoField>
        <InfoField label="Agreement Contract">
          <IdentityBadge entity={contractAddress} />
        </InfoField>
        <InfoField label="Creation Date">{creationDate}</InfoField>
      </div>
    </>
  )
}

AgreementDetails.propTypes = {
  ipfsUri: PropTypes.string,
  creationDate: PropTypes.string,
  contractAddress: PropTypes.string,
}

export default AgreementDetails
