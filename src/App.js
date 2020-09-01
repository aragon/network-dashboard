import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { LayoutProvider } from '@aragon/ui'
import { breakpoints } from './style/breakpoints'
import { OrgAppsProvider } from './providers/OrgApps'
import { VotesDataProvider } from './providers/VotesData'
import { AgreementDataProvider } from './providers/AgreementData'
import { ConnectProvider as Connect } from './providers/Connect'
import MainView from './components/MainView'
import Routes from './Routes'

function App() {
  return (
    <Connect>
      <OrgAppsProvider>
        <VotesDataProvider>
          <AgreementDataProvider>
            <ViewportProvider>
              <LayoutProvider breakpoints={breakpoints}>
                <Router>
                  <MainView>
                    <Routes />
                  </MainView>
                </Router>
              </LayoutProvider>
            </ViewportProvider>
          </AgreementDataProvider>
        </VotesDataProvider>
      </OrgAppsProvider>
    </Connect>
  )
}

export default App
