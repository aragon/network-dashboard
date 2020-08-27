import React from 'react'
import { Box, Header, Split } from '@aragon/ui'
import Layout from '../Layout'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import { useAppData } from '../../providers/AppData'

const Agreement = React.memo(function Agreement() {
  const { agreementDetails } = useAppData()

  const {
    title,
    content,
    contractAddress,
    contentIpfsUri,
    effectiveFrom,
    stakingAddress,
    disputableApps,
  } = agreementDetails

  return (
    <Layout>
      <Header primary="Agreement" />
      <Split
        primary={
          <>
            <Box>
              <AgreementHeader title={title} />
              <AgreementDetails
                contractAddress={contractAddress}
                creationDate={effectiveFrom}
                ipfsUri={contentIpfsUri}
                stakingAddress={stakingAddress}
              />
            </Box>
            <AgreementDocument content={content} />
          </>
        }
        secondary={<AgreementBindingActions disputableApps={disputableApps} />}
      />
    </Layout>
  )
})

export default Agreement
