import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { LayoutProvider } from '@aragon/ui'
import { AgreementProvider } from './providers/Agreement'
import { breakpoints } from './style/breakpoints'
import { ConnectProvider as Connect } from './providers/Connect'
import MainView from './components/MainView'
import { OrgAppsProvider } from './providers/OrgApps'
import { VotesProvider } from './providers/Votes'
import { WalletProvider } from './providers/Wallet'

import Routes from './Routes'

function App() {
  return (
    <Connect>
      <WalletProvider>
        <OrgAppsProvider>
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
        </OrgAppsProvider>
      </WalletProvider>
    </Connect>
  )
}

export default App
