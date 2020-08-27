import React from 'react'
import { utils as ethersUtils } from 'ethers'
import { Box, Header, Split } from '@aragon/ui'
import Layout from '../Layout'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import { toMs } from '../../lib/date-utils'
import { MOCK_AGREEMENT } from './mock-data'
import { useAppData } from '../../providers/AppData'

const Agreement = React.memo(function Agreement() {
  const { agreementDetails } = useAppData()
  const { content: mockAgreementContent } = MOCK_AGREEMENT

  const {
    title,
    contractAddress,
    content,
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
                creationDate={toMs(effectiveFrom)}
                ipfsUri={ethersUtils.toUtf8String(content)}
                stakingAddress={stakingAddress}
              />
            </Box>
            <AgreementDocument content={mockAgreementContent} />
          </>
        }
        secondary={<AgreementBindingActions disputableApps={disputableApps} />}
      />
    </Layout>
  )
})

export default Agreement
