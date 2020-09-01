import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDisputableVotes } from '../hooks/useDisputableVotes'

const VotesDataContext = React.createContext({
  votes: [],
  loading: true,
})

function VotesDataProvider({ children }) {
  const [votes, { loading }] = useDisputableVotes()

  const VotesDataState = useMemo(
    () => ({
      votes,
      loading,
    }),
    [votes, loading]
  )

  return (
    <VotesDataContext.Provider value={VotesDataState}>
      {children}
    </VotesDataContext.Provider>
  )
}

VotesDataProvider.propTypes = {
  children: PropTypes.node,
}

function useVotesData() {
  return useContext(VotesDataContext)
}

export { VotesDataProvider, useVotesData }
