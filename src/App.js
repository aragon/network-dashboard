import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { LayoutProvider } from '@aragon/ui'
import { AppDataProvider } from './providers/AppData'
import { breakpoints } from './style/breakpoints'
import { OrgAppsProvider } from './providers/OrgApps'
import { ConnectProvider as Connect } from './providers/Connect'
import MainView from './components/MainView'
import Routes from './Routes'

function App() {
  return (
    <Connect>
      <OrgAppsProvider>
        <AppDataProvider>
          <ViewportProvider>
            <LayoutProvider breakpoints={breakpoints}>
              <Router>
                <MainView>
                  <Routes />
                </MainView>
              </Router>
            </LayoutProvider>
          </ViewportProvider>
        </AppDataProvider>
      </OrgAppsProvider>
    </Connect>
  )
}

export default App
