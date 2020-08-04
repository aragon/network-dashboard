import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import initializeSentry from './sentry'

initializeSentry()

// Enable hot module replacement
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
