import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { BackButton, Bar, Header, GU } from '@aragon/ui'
import Layout from '../Layout'
import ProposalDetails from './ProposalDetails/ProposalDetails'
import ProposalLoading from './ProposalLoading'
import { useDisputableVote } from '../../hooks/useDisputableVotes'

const AnimatedDiv = styled(animated.div)`
  top: 0;
  left: 0;
  width: 100%;
`

function ProposalSingle({ match }) {
  const { id: proposalId } = match.params
  const history = useHistory()
  const [vote, { loading }] = useDisputableVote(proposalId)

  const handleBack = useCallback(() => {
    history.push(`/proposals`)
  }, [history])

  const loadingSwapTransitions = useTransition(loading, null, {
    config: { mass: 1, tension: 200, friction: 20 },
    from: { opacity: 0, transform: `translate3d(0, ${1 * GU}px, 0)` },
    enter: { opacity: 1, transform: `translate3d(0, 0, 0)` },
    leave: {
      opacity: 0,
      position: 'absolute',
      transform: `translate3d(0, -${1 * GU}px, 0)`,
    },
  })

  return (
    <>
      <Layout>
        <Header primary="Proposals" />
        <Bar>
          <BackButton onClick={handleBack} />
        </Bar>
        <div
          css={`
            position: relative;
          `}
        >
          {loadingSwapTransitions.map(({ item: loading, key, props }) =>
            loading ? (
              <AnimatedDiv style={props} key={key}>
                <ProposalLoading />
              </AnimatedDiv>
            ) : (
              <AnimatedDiv style={props} key={key}>
                <ProposalDetails vote={vote} />
              </AnimatedDiv>
            )
          )}
        </div>
      </Layout>
    </>
  )
}

ProposalSingle.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default ProposalSingle
