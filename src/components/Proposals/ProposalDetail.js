import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Bar,
  Box,
  GU,
  Header,
  IconCheck,
  IdentityBadge,
  Split,
  Tag,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { safeDiv } from '../../lib/math-utils'
import {
  DISPUTABLE_VOTE_STATUSES,
  VOTE_STATUS_CANCELLED,
  VOTE_STATUS_DISPUTED,
  VOTE_STATUS_PAUSED,
} from './disputable-vote-statuses'
import DisputableActionStatus from './DisputableActionStatus'
import InfoBoxes from './InfoBoxes'
import SummaryBar from './SummaryBar'
import FeedbackModule from './FeedbackModule'
import Layout from '../Layout'
import { addressesEqual } from '../../lib/web3-utils'
import { useDisputableVote } from '../../hooks/useDisputableVotes'

function getAttributes(status, theme) {
  const attributes = {
    [VOTE_STATUS_CANCELLED]: {
      backgroundColor: theme.surfacePressed,
      borderColor: theme.controlUnder,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_PAUSED]: {
      backgroundColor: '#fffdfa',
      borderColor: theme.warning,
      disabledProgressBars: true,
    },
    [VOTE_STATUS_DISPUTED]: {
      backgroundColor: '#FFF7F2',
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

function ProposalDetail({ match }) {
  const { id: proposalId } = match.params
  const [vote, { loading }] = useDisputableVote(proposalId)
  const theme = useTheme()

  const { layoutName } = useLayout()
  const history = useHistory()

  const handleBack = useCallback(() => {
    history.push(`/proposals`)
  }, [history])

  if (loading) {
    return <div>Loading...</div>
  }

  const { voteId, context, creator, yeas, nays } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)

  const disputableStatus = DISPUTABLE_VOTE_STATUSES.get(vote.status)
  const { backgroundColor, borderColor, disabledProgressBars } = getAttributes(
    disputableStatus,
    theme
  )
  // TODO: get real connected acount
  const connectedAccount = ''
  let mode = null

  if (vote.challenger && addressesEqual(vote.challenger, connectedAccount)) {
    mode = 'challenger'
  }

  if (addressesEqual(vote.creator, connectedAccount)) {
    mode = 'submitter'
  }
  // TODO: get youVoted flag from connector
  const youVoted = true

  return (
    <Layout>
      <Header />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
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
                  display: flex;
                  justify-content: space-between;
                `}
              >
                {youVoted && (
                  <Tag icon={<IconCheck size="small" />} label="Voted" />
                )}
              </div>
              <section
                css={`
                  display: grid;
                  grid-template-columns: auto;
                  grid-gap: ${2.5 * GU}px;
                  margin-top: ${2.5 * GU}px;
                `}
              >
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
                  <div>
                    <h2
                      css={`
                        ${textStyle('label2')};
                        color: ${theme.surfaceContentSecondary};
                        margin-bottom: ${2 * GU}px;
                      `}
                    >
                      Description
                    </h2>
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
                  </div>
                  <div>
                    <h2
                      css={`
                        ${textStyle('label2')};
                        color: ${theme.surfaceContentSecondary};
                        margin-bottom: ${2 * GU}px;
                      `}
                    >
                      Created By
                    </h2>
                    <div
                      css={`
                        display: flex;
                        align-items: flex-start;
                      `}
                    >
                      <IdentityBadge entity={creator} />
                    </div>
                  </div>
                </div>
                <div>
                  <h2
                    css={`
                      ${textStyle('label2')};
                      color: ${theme.surfaceContentSecondary};
                      margin-bottom: ${2 * GU}px;
                    `}
                  >
                    Votes
                  </h2>
                  <SummaryBar
                    disabledProgressBars={disabledProgressBars}
                    positiveSize={safeDiv(parseFloat(yeas), totalVotes)}
                    negativeSize={safeDiv(parseFloat(nays), totalVotes)}
                    requiredSize={0.5}
                    css={`
                      margin-bottom: ${2 * GU}px;
                    `}
                  />
                  {mode && (
                    <FeedbackModule
                      vote={vote}
                      connectedAccount={connectedAccount}
                      mode={mode}
                    />
                  )}
                </div>
              </section>
            </Box>
            <InfoBoxes
              vote={vote}
              disabledProgressBars={disabledProgressBars}
            />
          </>
        }
        secondary={<DisputableActionStatus vote={vote} />}
      />
    </Layout>
  )
}

ProposalDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default ProposalDetail
