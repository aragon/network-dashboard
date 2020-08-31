import React from 'react'
import { Box, Button, Header, Split } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
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
    <LayoutGutter>
      <LayoutLimiter>
        <Header
          primary="Agreement"
          secondary={<Button mode="strong" label="Sign Agreement" disabled />}
        />
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
          secondary={
            <AgreementBindingActions disputableApps={disputableApps} />
          }
        />
      </LayoutLimiter>
    </LayoutGutter>
  )
})

export default Agreement
