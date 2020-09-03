import React from 'react'
import { Button, Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import LoadingSection from '../Loading/LoadingSection'
import { useAgreement } from '../../providers/Agreement'

const Agreement = React.memo(function Agreement() {
  const { agreementDetails, loading } = useAgreement()

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header
          primary="Agreement"
          secondary={<Button mode="strong" label="Sign Agreement" disabled />}
        />
        <LoadingSection title="Loading agreement" loading={loading}>
          <AgreementLayout agreementDetails={agreementDetails} />
        </LoadingSection>
      </LayoutLimiter>
    </LayoutGutter>
  )
})

/* eslint-disable react/prop-types */
function AgreementLayout({ agreementDetails }) {
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
    <LayoutColumns
      primary={
        <>
          <LayoutBox primary>
            <AgreementHeader title={title} />
            <AgreementDetails
              contractAddress={contractAddress}
              creationDate={effectiveFrom}
              ipfsUri={contentIpfsUri}
              stakingAddress={stakingAddress}
            />
          </LayoutBox>
          <AgreementDocument content={content} />
        </>
      }
      secondary={<AgreementBindingActions disputableApps={disputableApps} />}
    />
  )
}
/* eslint-enable react/prop-types */

export default Agreement
