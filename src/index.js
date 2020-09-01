import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import initializeSentry from './sentry'
import { theme } from './style/theme'

initializeSentry()

// Enable hot module replacement
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  // Due to an issue with styled-components v5, global styles must be applied outside of <React.StrictMode/> to avoid duplicate styles inside the head.
  // As <Main/> provides us with some globals we need to ensure it sits outside.
  // See – https://github.com/styled-components/styled-components/issues/3008
  <Main
    assetsUrl="./aragon-ui/"
    layout={false}
    scrollView={false}
    theme={theme}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Main>,
  document.getElementById('root')
)
