import React from 'react'
import { Button, Box, Header, Split, noop } from '@aragon/ui'
import Layout from '../Layout'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import STATIC_AGREEMENT from './static-agreement'

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
            <Box>
              <AgreementHeader title="Aragon Network DAO Agreement" />
              <AgreementDetails
                contractAddress="0x5c6620c49f9aecf74bd483054f2d0ace0d375f96"
                creationDate="2020/07/20"
                ipfsUri="ipfs:Qmb5CHbQQQx6YXkPE6HodeXVmtCRgpSgkj9EkW9xs6jDHj"
              />
            </Box>
            <AgreementDocument content={STATIC_AGREEMENT} />
          </>
        }
        secondary={<Box>Binding actions</Box>}
      />
    </Layout>
  )
})

export default Agreement
