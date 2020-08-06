import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import initializeSentry from './sentry'

initializeSentry()

// Enable hot module replacement
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  // Global styles must be applied outside of <React.StrictMode/> to avoid duplicates being rendered inside head.
  // As <Main/> provides us with some globals we need to ensure it sits outside.
  // See – https://github.com/styled-components/styled-components/issues/3008
  <Main layout={false} scrollView={false}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Main>,
  document.getElementById('root')
)
