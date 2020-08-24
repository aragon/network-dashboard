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
} from './disputable-vote-statuses'
import { toMs } from '../../lib/date-utils'
import DisputableActions from './DisputableActions'
import DisputablePeriod from './DisputablePeriod'
import DisputableStatusLabel from './DisputableStatusLabel'

function DisputableActionStatus({ vote }) {
  // TODO: get agreement title, replace tokenAddress for tokenId
  // TODO: Check if vote has dispute
  const hasDispute = false
  const { actionAmount } = vote.collateral
  const { decimals, symbol } = vote.token

  const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const challenged = disputableStatus === VOTE_STATUS_PAUSED

  return (
    <Box heading="Disputable Action Status">
      <ul>
        <Item heading="Status">
          <DisputableStatusLabel status={disputableStatus} />
        </Item>
        <Item heading="Action collateral locked">
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
        <Item heading={challenged ? 'Settlement period' : 'Challenge period'}>
          <DisputablePeriod
            endDate={challenged ? toMs(vote.pausedAt) : toMs(vote.endDate)}
          />
        </Item>
        <Item heading="Agreement">
          <Link>agreementTitle</Link>
        </Item>
        {hasDispute && (
          <Item heading="Dispute">
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
          <DisputableActions
            status={disputableStatus}
            submitter={vote.creator}
          />
        </Item>
      </ul>
    </Box>
  )
}

function Item({ heading, children }) {
  const theme = useTheme()
  return (
    <li
      css={`
        list-style: none;
        & + li {
          margin-top: ${3 * GU}px;
        }
      `}
    >
      {heading && (
        <h1
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
            display: block;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {heading}
        </h1>
      )}
      {children}
    </li>
  )
}

Item.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
}

DisputableActionStatus.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default DisputableActionStatus
