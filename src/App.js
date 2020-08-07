import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConnectProvider as Connect } from './providers/Connect'
import MainView from './components/MainView'
import Routes from './Routes'

function App() {
  return (
    <Connect>
      <Router>
        <MainView>
          <Routes />
        </MainView>
      </Router>
    </Connect>
  )
}

export default App
