import React from 'react'
import PropTypes from 'prop-types'
import { Layout, useViewport } from '@aragon/ui'
import { breakpoints } from '../style/breakpoints'

function CustomLayout({ children, ...props }) {
  const { width: vw } = useViewport()
  return (
    <Layout
      breakpoints={breakpoints}
      parentWidth={vw}
      paddingBottom={0}
      {...props}
    >
      {children}
    </Layout>
  )
}

CustomLayout.propTypes = {
  children: PropTypes.node,
}

export default CustomLayout
