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
import { useGetVote } from '../../hooks/disputable-voting-logic'
import DisputableActionStatus from './DisputableActionStatus'
import InfoBoxes from './InfoBoxes'
import SummaryBar from './SummaryBar'
import Layout from '../Layout'
import { networkEnvironment } from '../../current-environment'

function ProposalDetail({ match }) {
  const { id: proposalId } = match.params
  const { disputableVotingApp } = networkEnvironment
  const theme = useTheme()

  const { layoutName } = useLayout()
  const history = useHistory()

  const handleBack = useCallback(() => {
    history.push(`/proposals`)
  }, [history])

  const [vote, { loading, error }] = useGetVote(
    `${disputableVotingApp}-vote-${proposalId}`
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error(error)
  }

  const { voteId, context, creator, yeas, nays } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)

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
            <Box>
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
                    positiveSize={safeDiv(parseFloat(yeas), totalVotes)}
                    negativeSize={safeDiv(parseFloat(nays), totalVotes)}
                    requiredSize={0.5}
                    css={`
                      margin-bottom: ${2 * GU}px;
                    `}
                  />
                </div>
              </section>
            </Box>
            <InfoBoxes vote={vote} />
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
