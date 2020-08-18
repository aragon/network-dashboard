import React from 'react'
import { Button, Box, Header, Split, noop } from '@aragon/ui'
import Layout from '../Layout'

const Agreement = React.memo(function Agreement() {
  return (
    <Layout>
      <Header
        primary="Agreement"
        secondary={
          <Button mode="strong" label="Sign Agreement" onClick={noop} />
        }
      />
      <Split
        primary={
          <>
            <Box>Details</Box>
            <Box>Document</Box>
          </>
        }
        secondary={<Box>Binding actions</Box>}
      />
    </Layout>
  )
})

export default Agreement
