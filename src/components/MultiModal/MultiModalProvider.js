import React, { useContext, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSteps } from '../../hooks/useSteps'

const MultiModalContext = React.createContext({})

function MultiModalProvider({ screens, children }) {
  const { direction, next, prev, step } = useSteps(screens.length)
  const getScreen = useCallback((step) => screens[step], [screens])
  const currentScreen = useMemo(() => getScreen(step), [getScreen, step])

  const multiModalState = useMemo(
    () => ({
      // Prevent possible destructure error if screens length is dynamically reduced below current index
      currentScreen: currentScreen || {},
      direction,
      getScreen,
      next,
      prev,
      step,
    }),
    [currentScreen, direction, getScreen, next, prev, step]
  )

  return (
    <MultiModalContext.Provider value={multiModalState}>
      {children}
    </MultiModalContext.Provider>
  )
}

MultiModalProvider.propTypes = {
  children: PropTypes.node,
  screens: PropTypes.array,
}

function useMultiModal() {
  return useContext(MultiModalContext)
}

export { MultiModalProvider, useMultiModal }
