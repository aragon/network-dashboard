import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Bar,
  Box,
  GU,
  IdentityBadge,
  Split,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { safeDiv } from '../../utils/math-utils'
import { useGetVote } from '../../hooks/disputable-voting-logic'
import DisputableActionStatus from './DisputableActionStatus'
import InfoBoxes from './InfoBoxes'
import SummaryBar from './SummaryBar'

function ProposalDetail({ match }) {
  const { id: proposalId } = match.params
  const theme = useTheme()

  const { layoutName } = useLayout()
  const history = useHistory()
  const handleBack = () => {
    history.push(`/proposals`)
  }

  const { voteLoading, vote } = useGetVote(proposalId)

  if (voteLoading) {
    return <div>Loading...</div>
  }

  const { voteId, context, creator, yeas, nays } = vote
  const totalVotes = parseFloat(yeas) + parseFloat(nays)

  return (
    <>
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
                voted?
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
                  `}
                >
                  <span css="font-weight: bold;">Vote #{voteId}</span>
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
            <InfoBoxes vote={vote} setting={vote.settings} />
          </>
        }
        secondary={<DisputableActionStatus vote={vote} />}
      />
    </>
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
