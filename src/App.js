import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import { ConnectProvider as Connect } from './providers/Connect'
import MainView from './components/MainView'
import Routes from './Routes'

function App() {
  return (
    <Connect>
      <ViewportProvider>
        <Router>
          <MainView>
            <Routes />
          </MainView>
        </Router>
      </ViewportProvider>
    </Connect>
  )
}

export default App
