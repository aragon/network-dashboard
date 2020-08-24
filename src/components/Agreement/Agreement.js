import React, { useMemo } from 'react'
import { Box, Header, Split } from '@aragon/ui'
import Layout from '../Layout'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import { durationToHours } from '../../lib/date-utils'
import { MOCK_AGREEMENT } from './mock-data'
import { useAgreementDetails } from '../../hooks/useAgreementDetails'

const Agreement = React.memo(function Agreement() {
  const agreementDetails = useAgreementDetails()

  const { content, connectedApps } = MOCK_AGREEMENT

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

  if (!agreementDetails) {
    return <div>...Loading</div>
  }

  return (
    <Layout>
      <Header primary="Agreement" />
      <Split
        primary={
          <>
            <Box>
              <AgreementHeader title={agreementDetails.title} />
              <AgreementDetails
                contractAddress={agreementDetails.contractAddress}
                creationDate={agreementDetails.effectiveFrom}
                ipfsUri={agreementDetails.contentUri}
                stakingAddress={agreementDetails.stakingAddress}
              />
            </Box>
            <AgreementDocument content={content} />
          </>
        }
        secondary={<AgreementBindingActions apps={mockBindingActions} />}
      />
    </Layout>
  )
})

export default Agreement
