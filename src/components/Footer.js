import React from 'react'
import { useTheme, GU } from '@aragon/ui'
import Layout from './Layout'

function Footer() {
  const theme = useTheme()
  return (
    <footer
      css={`
        background-color: ${theme.surface};
        padding-top: ${3 * GU}px;
        padding-bottom: ${3 * GU}px;
      `}
    >
      <Layout>footer</Layout>
    </footer>
  )
}

export default Footer
