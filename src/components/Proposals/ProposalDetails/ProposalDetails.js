import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  IconCheck,
  IconLock,
  IdentityBadge,
  Split,
  Tag,
  TokenAmount,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import DisputableActionStatus from './DisputableActionStatus'
import DisputableStatusLabel from '../DisputableStatusLabel'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_PAUSED,
} from '../disputable-vote-statuses'
import InfoField from '../../InfoField'
import InfoBoxes from './InfoBoxes'
import { safeDiv } from '../../../lib/math-utils'
import SummaryBar from './SummaryBar'
import SummaryRow from './SummaryRow'
import StatusInfo from './StatusInfo'
import FeedbackModule from './FeedbackModule'
import Description from '../Description'
import { addressesEqual } from '../../../lib/web3-utils'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_CANCELLED]: {
      backgroundColor: theme.surfacePressed,
      borderColor: theme.border,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_PAUSED]: {
      backgroundColor: '#fefdfb',
      borderColor: theme.warning,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_DISPUTED]: {
      backgroundColor: '#FFFAFA',
      borderColor: '#FF7C7C',
      disabledProgressBars: true,
    },
  }

  return (
    attributes[status] || {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      disabledProgressBars: false,
    }
  )
}

function ProposalDetail({ vote }) {
  const theme = useTheme()

  const { voteId } = vote
  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const { backgroundColor, borderColor, disabledProgressBars } = getAttributes(
    disputableStatus,
    theme
  )

  // TODO: get youVoted flag from connector
  const youVoted = false

  return (
    <Split
      primary={
        <>
          <Box
            css={`
              background: ${backgroundColor};
              border: solid 1px ${borderColor};
            `}
          >
            <div
              css={`
                display: grid;
                grid-auto-flow: row;

                grid-gap: ${4 * GU}px;
              `}
            >
              {youVoted && (
                <div
                  css={`
                    display: flex;
                  `}
                >
                  <Tag icon={<IconCheck size="small" />} label="Voted" />
                </div>
              )}
              <h1
                css={`
                  ${textStyle('title2')};
                  font-weight: bold;
                `}
              >
                Vote #{voteId}
              </h1>
              <Details vote={vote} status={disputableStatus} />
              <SummaryInfo
                vote={vote}
                disabledProgressBars={disabledProgressBars}
              />
            </div>
          </Box>
        </>
      }
      secondary={
        <>
          <DisputableActionStatus vote={vote} />
          <InfoBoxes vote={vote} disabledProgressBars={disabledProgressBars} />
        </>
      }
    />
  )
}

/* eslint-disable react/prop-types */
function Details({ vote, status }) {
  const { context, creator, collateral, token, description } = vote
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  // TODO: Replace tokenAddress for tokenId
  const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

  return (
    <div
      css={`
        display: grid;

        grid-template-columns: ${compactMode ? '1fr' : `1fr ${30 * GU}px`};
        grid-gap: ${3 * GU}px;
      `}
    >
      {Array.isArray(description) ? (
        <div>
          <InfoField label="Description">
            <Description path={description} />
          </InfoField>
          <InfoField
            label="Justification"
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            {context}
          </InfoField>
        </div>
      ) : (
        <InfoField label="Description">{context}</InfoField>
      )}
      <InfoField label="Status">
        <DisputableStatusLabel status={status} />
      </InfoField>

      <InfoField label="Action collateral">
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <TokenAmount
            address={tokenAddress}
            amount={collateral.actionAmount}
            decimals={token.decimals}
            symbol={token.symbol}
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
      </InfoField>
      <InfoField label="Submitted By">
        <div
          css={`
            display: flex;
            align-items: flex-start;
          `}
        >
          <IdentityBadge entity={creator} />
        </div>
      </InfoField>
    </div>
  )
}

function SummaryInfo({ vote, disabledProgressBars }) {
  const theme = useTheme()

  const { yeas, nays } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)
  const yeasPct = safeDiv(parseFloat(yeas), totalVotes)
  const naysPct = safeDiv(parseFloat(nays), totalVotes)

  // TODO: get real connected account
  const connectedAccount = ''

  let mode = null

  if (vote.challenger && addressesEqual(vote.challenger, connectedAccount)) {
    mode = 'challenger'
  }

  if (addressesEqual(vote.creator, connectedAccount)) {
    mode = 'submitter'
  }

  return (
    <div>
      <InfoField label="Votes">
        <SummaryBar
          disabledProgressBars={disabledProgressBars}
          positiveSize={yeasPct}
          negativeSize={naysPct}
          requiredSize={
            parseFloat(vote.settings.formattedMinimumAcceptanceQuorumPct) / 100
          }
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        />
        <div
          css={`
            display: inline-block;
          `}
        >
          <SummaryRow
            color={disabledProgressBars ? theme.surfaceOpened : theme.positive}
            label="Yes"
            pct={yeasPct * 100}
            token={{
              amount: yeas,
              symbol: 'ANT',
              decimals: 18,
            }}
          />
          <SummaryRow
            color={disabledProgressBars ? theme.controlUnder : theme.negative}
            label="No"
            pct={naysPct * 100}
            token={{
              amount: nays,
              symbol: 'ANT',
              decimals: 18,
            }}
          />
        </div>
      </InfoField>

      {mode && (
        <FeedbackModule
          vote={vote}
          connectedAccount={connectedAccount}
          mode={mode}
        />
      )}
      <StatusInfo vote={vote} />
    </div>
  )
}
/* eslint-disable react/prop-types */

ProposalDetail.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default ProposalDetail
