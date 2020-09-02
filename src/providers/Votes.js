import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDisputableVotes } from '../hooks/useDisputableVotes'

const VotesContext = React.createContext({
  votes: [],
  loading: true,
})

function VotesProvider({ children }) {
  const [votes, loading] = useDisputableVotes()

  const VotesState = useMemo(
    () => ({
      votes,
      loading,
    }),
    [votes, loading]
  )

  return (
    <VotesContext.Provider value={VotesState}>{children}</VotesContext.Provider>
  )
}

VotesProvider.propTypes = {
  children: PropTypes.node,
}

function useVotes() {
  return useContext(VotesContext)
}

export { VotesProvider, useVotes }
