import React from 'react'
import PropTypes from 'prop-types'
import { Layout, useViewport } from '@aragon/ui'
import { BREAKPOINTS } from '../breakpoints'

function CustomLayout({ children }) {
  const { width: vw } = useViewport()
  return (
    <Layout breakpoints={BREAKPOINTS} parentWidth={vw} paddingBottom={0}>
      {children}
    </Layout>
  )
}

CustomLayout.propTypes = {
  children: PropTypes.node,
}

export default CustomLayout
