import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  IconLock,
  Info,
  Link,
  textStyle,
  TokenAmount,
  useTheme,
} from '@aragon/ui'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_PAUSED,
} from '../../utils/disputable-vote-statuses'
import { toMs } from '../../utils/date-utils'
import DisputableActions from './DisputableActions'
import DisputablePeriod from './DisputablePeriod'
import DisputableStatusLabel from './DisputableStatusLabel'

function hasDispute(vote) {
  // TODO: Check if vote has dispute
  return false
}

function DisputableActionStatus({ vote }) {
  // TODO: get agreement title
  // TODO: get collateral info from connector (actionAmount,decimals,symbol)
  const actionAmount = 100000000000000000000
  const decimals = 18
  const symbol = 'DAI'
  const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const challenged = disputableStatus === VOTE_STATUS_PAUSED

  return (
    <Box heading="Disputable Action Status">
      <ul>
        <Item label="Status">
          {disputableStatus && (
            <DisputableStatusLabel status={disputableStatus} />
          )}
        </Item>
        <Item label="Action collateral locked">
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <TokenAmount
              address={tokenAddress}
              amount={actionAmount}
              decimals={decimals}
              symbol={symbol}
            />

            <span
              css={`
                display: inline-flex;
                padding-left: ${1 * GU}px;
              `}
            >
              <IconLock size="small" />
            </span>
          </div>
        </Item>
        <Item label={challenged ? 'Settlement period' : 'Challenge period'}>
          <DisputablePeriod
            endDate={
              challenged
                ? toMs(vote.pausedAt)
                : new Date(toMs(vote.endDate)).getTime()
            }
          />
        </Item>
        <Item label="Agreement">
          <Link>agreementTitle</Link>
        </Item>
        {hasDispute(vote) && (
          <Item label="Dispute">
            <Link href={`https://court.aragon.org/disputes/${vote.disputeId}`}>
              Dispute #{vote.disputeId}
            </Link>
          </Item>
        )}
        <Item>
          <Info>
            Exceeding reaction chamber thermal limit. We have begun power-supply
            calibration. Force fields have been established on all turbo lifts
            and crawlways. Warp drive within normal parameters. I read an ion
            trail.
          </Info>
        </Item>
        <Item>
          {disputableStatus && (
            <DisputableActions
              status={disputableStatus}
              submitter={vote.creator}
            />
          )}
        </Item>
      </ul>
    </Box>
  )
}

function Item({ label, children }) {
  const theme = useTheme()
  return (
    <li
      css={`
        list-style-type: none;
        & + li {
          margin-top: ${3 * GU}px;
        }
      `}
    >
      {label && (
        <label
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
            display: block;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {label}
        </label>
      )}
      {children}
    </li>
  )
}

Item.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
}

DisputableActionStatus.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default DisputableActionStatus
