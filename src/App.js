import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import MainView from './components/MainView'
import Routes from './Routes'

function App() {
  return (
    <Router>
      <MainView>
        <Routes />
      </MainView>
    </Router>
  )
}

export default App
