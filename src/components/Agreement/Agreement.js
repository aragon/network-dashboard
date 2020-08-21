import React, { useMemo } from 'react'
import { Button, Box, Header, Split, noop } from '@aragon/ui'
import Layout from '../Layout'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import { durationToHours } from '../../lib/date-utils'
import { MOCK_AGREEMENT } from './mock-data'

const Agreement = React.memo(function Agreement() {
  const {
    content,
    connectedApps,
    contractAddress,
    creationDate,
    ipfsUri,
  } = MOCK_AGREEMENT

  const apps = useMemo(
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
                contractAddress={contractAddress}
                creationDate={creationDate}
                ipfsUri={ipfsUri}
              />
            </Box>
            <AgreementDocument content={content} />
          </>
        }
        secondary={<AgreementBindingActions apps={apps} />}
      />
    </Layout>
  )
})

export default Agreement
