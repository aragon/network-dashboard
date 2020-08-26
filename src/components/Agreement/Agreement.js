import React, { useMemo } from 'react'
import { utils as ethersUtils } from 'ethers'
import { Box, Header, Split } from '@aragon/ui'
import Layout from '../Layout'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import { durationToHours, toMs } from '../../lib/date-utils'
import { MOCK_AGREEMENT } from './mock-data'
import { useAppData } from '../../providers/AppData'

const Agreement = React.memo(function Agreement() {
  const { agreementDetails } = useAppData()
  const { connectedApps, content: mockAgreementContent } = MOCK_AGREEMENT

  const mockBindingActions = useMemo(
    () =>
      connectedApps.map(
        ({
          appName,
          appAddress,
          actionAmount,
          collateralToken: { address, decimals, symbol },
          challengeAmount,
          challengeDuration,
        }) => {
          return {
            appName,
            appAddress,
            actionCollateral: {
              amount: actionAmount,
              symbol,
              address,
              decimals,
            },
            challengeCollateral: {
              amount: challengeAmount,
              symbol,
              address,
              decimals,
            },
            settlementPeriod: durationToHours(challengeDuration),
          }
        }
      ),
    [connectedApps]
  )

  const {
    title,
    contractAddress,
    content,
    effectiveFrom,
    stakingAddress,
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
        secondary={<AgreementBindingActions apps={mockBindingActions} />}
      />
    </Layout>
  )
})

export default Agreement
