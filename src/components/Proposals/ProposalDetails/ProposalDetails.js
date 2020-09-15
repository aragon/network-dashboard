import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  GU,
  Button,
  IconCheck,
  IconLock,
  IdentityBadge,
  Link,
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
  VOTE_STATUS_SETTLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_CHALLENGED,
} from '../disputable-vote-statuses'
import InfoField from '../../InfoField'
import InfoBoxes from './InfoBoxes'
import LayoutColumns from '../../Layout/LayoutColumns'
import LayoutBox from '../../Layout/LayoutBox'
import { safeDiv } from '../../../lib/math-utils'
import SummaryBar from './SummaryBar'
import SummaryRow from './SummaryRow'
import StatusInfo from './StatusInfo'
import FeedbackModule from './FeedbackModule'
import Description from '../Description'
import TargetAppBadge from '../TargetAppBadge'
import { addressesEqual } from '../../../lib/web3-utils'
import { getIpfsUrlFromUri } from '../../../lib/ipfs-utils'
import { useDescribeVote } from '../../../hooks/useDescribeVote'
import LoadingSkeleton from '../../Loading/LoadingSkeleton'
import { useWallet } from '../../../providers/Wallet'
import MultiModal from '../../MultiModal/MultiModal'
import VoteOnProposalScreens from '../../ModalFlows/VoteOnProposalScreens/VoteOnProposalScreens'

function getDisputablePresentation(disputableStatus) {
  const disputablePresentation = {
    [VOTE_STATUS_CANCELLED]: {
      boxPresentation: 'disabled',
      disabledProgressBars: true,
    },
    [VOTE_STATUS_SETTLED]: {
      boxPresentation: 'disabled',
      disabledProgressBars: true,
    },
    [VOTE_STATUS_CHALLENGED]: {
      boxPresentation: 'warning',
      disabledProgressBars: true,
    },
    [VOTE_STATUS_DISPUTED]: {
      boxPresentation: 'negative',
      disabledProgressBars: true,
    },
  }

  return disputablePresentation[disputableStatus] || {}
}

function ProposalDetails({ vote }) {
  const { voteId, id, script } = vote
  const { account } = useWallet()
  const [voteModalVisible, setVoteModalVisible] = useState(false)
  const [voteSupported, setVoteSupported] = useState(null)
  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)

  const handleCastVote = useCallback((supported) => {
    setVoteModalVisible(true)
    setVoteSupported(supported)
  }, [])

  const handleModalClose = useCallback(() => {
    setVoteModalVisible(false)
  }, [])

  const { boxPresentation, disabledProgressBars } = getDisputablePresentation(
    disputableStatus
  )

  // TODO: get youVoted flag from connector
  const youVoted = false

  return (
    <>
      <LayoutColumns
        primary={
          <LayoutBox primary mode={boxPresentation}>
            <div
              css={`
                display: grid;
                grid-auto-flow: row;

                grid-gap: ${4 * GU}px;
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <TargetAppBadge script={script} voteId={id} />
                {youVoted && (
                  <Tag icon={<IconCheck size="small" />} label="Voted" />
                )}
              </div>
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
          </LayoutBox>
        }
        secondary={
          <>
            <DisputableActionStatus vote={vote} />
            <InfoBoxes
              vote={vote}
              disabledProgressBars={disabledProgressBars}
            />
          </>
        }
      />
      <Button
        mode="strong"
        disabled={!account}
        onClick={() => handleCastVote(true)}
      >
        Vote Yes
      </Button>
      <Button
        mode="strong"
        disabled={!account}
        onClick={() => handleCastVote(false)}
      >
        Vote No
      </Button>
      <MultiModal visible={voteModalVisible} onClose={handleModalClose}>
        <VoteOnProposalScreens voteId={voteId} voteSupported={voteSupported} />
      </MultiModal>
    </>
  )
}

/* eslint-disable react/prop-types */
function Details({ vote, status }) {
  const { context, creator, collateral, token, script } = vote
  const {
    description,
    emptyScript,
    loading: descriptionLoading,
  } = useDescribeVote(script, vote.id)

  const { layoutName } = useLayout()

  const twoColumnMode = layoutName === 'max'

  const justificationUrl = useMemo(
    () => (context.startsWith('ipfs') ? getIpfsUrlFromUri(context) : null),
    [context]
  )

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: ${twoColumnMode ? `1fr ${30 * GU}px` : '1fr'};
        grid-gap: ${3 * GU}px;
      `}
    >
      {emptyScript ? (
        <InfoField label="Description">
          <p>{context}</p>
        </InfoField>
      ) : (
        <div>
          <InfoField label="Description">
            <DescriptionWithSkeleton
              description={description}
              loading={descriptionLoading}
            />
          </InfoField>

          <InfoField
            label="Justification"
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            {justificationUrl ? (
              <Link
                href={justificationUrl}
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
                  Read more
                </span>
              </Link>
            ) : (
              <p>{context}</p>
            )}
          </InfoField>
        </div>
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
            address={token.id}
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

function DescriptionWithSkeleton({ description, loading }) {
  if (loading) {
    return (
      <>
        <LoadingSkeleton
          css={`
            width: 95%;
          `}
        />
        <LoadingSkeleton
          css={`
            width: 70%;
          `}
        />
        <LoadingSkeleton
          css={`
            width: 35%;
          `}
        />
      </>
    )
  }

  return <Description path={description} />
}

function SummaryInfo({ vote, disabledProgressBars }) {
  const { account: connectedAccount } = useWallet()
  const theme = useTheme()

  const { yeas, nays } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)
  const yeasPct = safeDiv(parseFloat(yeas), totalVotes)
  const naysPct = safeDiv(parseFloat(nays), totalVotes)

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

ProposalDetails.propTypes = {
  vote: PropTypes.object,
}

export default ProposalDetails
