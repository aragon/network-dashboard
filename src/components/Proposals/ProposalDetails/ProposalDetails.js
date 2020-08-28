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
      backgroundColor: '#fffbf9',
      borderColor: '#D26C41',
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

  const { layoutName } = useLayout()

  // TODO: replace tokenAddress for tokenId
  const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

  const { voteId, context, creator, yeas, nays, collateral, token } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)
  const yeasPct = safeDiv(parseFloat(yeas), totalVotes)
  const naysPct = safeDiv(parseFloat(nays), totalVotes)

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const { backgroundColor, borderColor, disabledProgressBars } = getAttributes(
    disputableStatus,
    theme
  )

  // TODO: get real connected account
  const connectedAccount = ''
  let mode = null

  if (vote.challenger && addressesEqual(vote.challenger, connectedAccount)) {
    mode = 'challenger'
  }

  if (addressesEqual(vote.creator, connectedAccount)) {
    mode = 'submitter'
  }
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
            <section
              css={`
                display: grid;
                grid-template-columns: auto;
                grid-gap: ${2.5 * GU}px;
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
              <div
                css={`
                  display: grid;
                  grid-template-columns: ${layoutName === 'large'
                    ? '1fr minmax(300px, auto)'
                    : 'auto'};
                  grid-gap: ${layoutName === 'large' ? 5 * GU : 2.5 * GU}px;
                `}
              >
                <InfoField label="Description">
                  <div
                    css={`
                      hyphens: auto;
                      overflow-wrap: anywhere;
                      word-break: break-word;
                    `}
                  >
                    {context ||
                      'No additional description has been provided for this proposal.'}
                  </div>
                </InfoField>
                <div
                  css={`
                    display: flex;
                    justify-content: space-between;
                  `}
                >
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
                  <InfoField
                    label="Submitted By"
                    css={`
                      margin-right: ${12 * GU}px;
                    `}
                  >
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
              </div>
              <div>
                <InfoField label="Votes">
                  <SummaryBar
                    disabledProgressBars={disabledProgressBars}
                    positiveSize={yeasPct}
                    negativeSize={naysPct}
                    requiredSize={
                      parseFloat(
                        vote.settings.formattedMinimumAcceptanceQuorumPct
                      ) / 100
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
                      color={
                        disabledProgressBars
                          ? theme.surfaceOpened
                          : theme.positive
                      }
                      label="Yes"
                      pct={yeasPct * 100}
                      token={{
                        amount: yeas,
                        symbol: 'ANT',
                        decimals: 18,
                      }}
                    />
                    <SummaryRow
                      color={
                        disabledProgressBars
                          ? theme.controlUnder
                          : theme.negative
                      }
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
            </section>
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

ProposalDetail.propTypes = {
  vote: PropTypes.object.isRequired,
}

export default ProposalDetail
