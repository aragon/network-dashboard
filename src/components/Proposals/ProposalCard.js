import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, textStyle, useTheme } from '@aragon/ui'
import { DISPUTABLE_VOTE_STATUSES } from './disputable-vote-statuses'
import ProposalOption from './ProposalOption'
import DisputableStatusLabel from './DisputableStatusLabel'

function ProposalCard({ vote, onProposalClick }) {
  const theme = useTheme()
  const { context, voteId } = vote

  return (
    <Card
      onClick={() => onProposalClick(voteId)}
      css={`
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 1fr auto auto;
        grid-gap: ${1 * GU}px;
        padding: ${3 * GU}px;
      `}
    >
      <p
        css={`
          // overflow-wrap:anywhere and hyphens:auto are not supported yet by
          // the latest versions of Safari (as of June 2020), which
          // is why word-break:break-word has been added here.
          hyphens: auto;
          overflow-wrap: anywhere;
          word-break: break-word;
          ${textStyle('body1')}
        `}
      >
        <strong css="font-weight: bold">#{voteId}: </strong>
        {context || 'No description provided'}
      </p>
      <ProposalOption
        color={theme.positive}
        percentage={(vote.yeas * 100) / vote.votingPower}
        label={
          <WrapProposalOption>
            <span>Yes</span>
          </WrapProposalOption>
        }
      />
      <ProposalOption
        color={theme.negative}
        percentage={(vote.nays * 100) / vote.votingPower}
        label={
          <WrapProposalOption>
            <span>No</span>
          </WrapProposalOption>
        }
      />
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <DisputableStatusLabel
          status={DISPUTABLE_VOTE_STATUSES.get(vote.status)}
        />
      </div>
    </Card>
  )
}
function WrapProposalOption(props) {
  return (
    <span
      css={`
        display: flex;
        align-items: center;
        text-transform: uppercase;
        ${textStyle('label2')};
      `}
      {...props}
    />
  )
}
ProposalCard.propTypes = {
  vote: PropTypes.object,
  onProposalClick: PropTypes.func.isRequired,
}

export default ProposalCard
