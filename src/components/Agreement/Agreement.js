import React from 'react'
import { Button, Box, Layout, Header, Split, noop } from '@aragon/ui'

const Agreement = React.memo(function Agreement() {
  return (
    <Layout paddingBottom={0}>
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
