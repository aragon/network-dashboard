import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { LayoutProvider } from '@aragon/ui'
import { AgreementStateProvider } from './providers/AgreementState'
import { breakpoints } from './style/breakpoints'
import { ConnectProvider as Connect } from './providers/Connect'
import GlobalErrorHandler from './GlobalErrorHandler'
import MainView from './components/MainView'
import { OrgAppsProvider } from './providers/OrgApps'
import { VotesProvider } from './providers/Votes'
import { WalletProvider } from './providers/Wallet'

import Routes from './Routes'

function App() {
  return (
    <GlobalErrorHandler>
      <Connect>
        <WalletProvider>
          <OrgAppsProvider>
            <VotesProvider>
              <AgreementStateProvider>
                <ViewportProvider>
                  <LayoutProvider breakpoints={breakpoints}>
                    <Router>
                      <MainView>
                        <Routes />
                      </MainView>
                    </Router>
                  </LayoutProvider>
                </ViewportProvider>
              </AgreementStateProvider>
            </VotesProvider>
          </OrgAppsProvider>
        </WalletProvider>
      </Connect>
    </GlobalErrorHandler>
  )
}

export default App
