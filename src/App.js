import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { AppDataProvider } from './providers/AppData'
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
            <Router>
              <MainView>
                <Routes />
              </MainView>
            </Router>
          </ViewportProvider>
        </AppDataProvider>
      </OrgAppsProvider>
    </Connect>
  )
}

export default App
