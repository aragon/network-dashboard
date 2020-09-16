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
import { WalletProvider } from './providers/Wallet'
import { VotesSubscriptionProvider } from './providers/VotesSubscription'

import Routes from './Routes'

function App() {
  return (
    <GlobalErrorHandler>
      <Connect>
        <WalletProvider>
          <OrgAppsProvider>
            <VotesSubscriptionProvider>
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
            </VotesSubscriptionProvider>
          </OrgAppsProvider>
        </WalletProvider>
      </Connect>
    </GlobalErrorHandler>
  )
}

export default App
