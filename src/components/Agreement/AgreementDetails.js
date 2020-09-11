import React from 'react'
import PropTypes from 'prop-types'
import {
  textStyle,
  IdentityBadge,
  Link,
  IconCheck,
  useLayout,
  useTheme,
  GU,
  RADIUS,
} from '@aragon/ui'
import { dateFormat } from '../../utils/date-utils'
import InfoField from '../InfoField'
import { getIpfsCidFromUri, getIpfsUrlFromUri } from '../../lib/ipfs-utils'
import { networkEnvironment } from '../../current-environment'

function AgreementDetails({
  creationDate,
  contractAddress,
  ipfsUri,
  stakingAddress,
  signedAgreement,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const multiColumnsMode = layoutName === 'max' || layoutName === 'medium'

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
          grid-gap: ${multiColumnsMode ? 2 * GU : 3 * GU}px;
          grid-auto-flow: ${multiColumnsMode ? 'column' : 'row'};
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

      {signedAgreement && (
        <div
          css={`
            display: flex;
            justify-content: center;
            margin-top: ${5 * GU}px;
            background-color: ${theme.background};
            border: 1px solid ${theme.border};
            padding: ${4 * GU}px;
            border-radius: ${RADIUS}px;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 100%;
                color: ${theme.accent};
                border: 2px solid currentColor;
                width: ${5.5 * GU}px;
                height: ${5.5 * GU}px;
                margin-right: ${2 * GU}px;
                flex-shrink: 0;
              `}
            >
              <IconCheck />
            </div>
            <div>
              <h2
                css={`
                  ${textStyle('body1')}
                  font-weight: 600;
                `}
              >
                You have sucessfully signed this Agreement
              </h2>
              <p
                css={`
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                You can now manage your token balances on Stake Management.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

AgreementDetails.propTypes = {
  contractAddress: PropTypes.string,
  creationDate: PropTypes.number,
  ipfsUri: PropTypes.string,
  stakingAddress: PropTypes.string,
  signedAgreement: PropTypes.bool,
}

export default AgreementDetails
