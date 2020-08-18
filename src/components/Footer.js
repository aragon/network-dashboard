import React from 'react'
import { Layout, useTheme, GU } from '@aragon/ui'

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
      <Layout paddingBottom={0}>footer</Layout>
    </footer>
  )
}

export default Footer
