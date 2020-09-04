import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { LayoutProvider } from '@aragon/ui'
import { AgreementProvider } from './providers/Agreement'
import { breakpoints } from './style/breakpoints'
import MainView from './components/MainView'
import { AppStateProvider } from './providers/AppState'
import { VotesProvider } from './providers/Votes'

import Routes from './Routes'

function App() {
  return (
    <AppStateProvider>
      <VotesProvider>
        <AgreementProvider>
          <ViewportProvider>
            <LayoutProvider breakpoints={breakpoints}>
              <Router>
                <MainView>
                  <Routes />
                </MainView>
              </Router>
            </LayoutProvider>
          </ViewportProvider>
        </AgreementProvider>
      </VotesProvider>
    </AppStateProvider>
  )
}

export default App
