import React, { useState } from 'react'
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
import MultiModal from '../MultiModal/MultiModal'
import SignAgreementModal from '../ModalFlows/SignAgreementModal/SignAgreementModal'
import { useAgreement } from '../../providers/Agreement'
import { useWallet } from '../../providers/Wallet'
import { useAgreementSign } from '../../hooks/useAgreementSign'

const Agreement = React.memo(function Agreement() {
  const { account } = useWallet()
  const [signAgreementVisible, setSignAgreementVisible] = useState(false)
  const { agreementDetails, loading } = useAgreement()
  const { signed } = useAgreementSign()

  return (
    <>
      <LayoutGutter>
        <LayoutLimiter>
          <Header
            primary="Agreement"
            secondary={
              <Button
                mode="strong"
                label="Sign Agreement"
                disabled={!account || signed}
                onClick={() => setSignAgreementVisible(true)}
              />
            }
          />
          <LoadingSection title="Loading agreement" loading={loading}>
            <AgreementLayout agreementDetails={agreementDetails} />
          </LoadingSection>
        </LayoutLimiter>
      </LayoutGutter>
      <MultiModal
        visible={signAgreementVisible}
        onClose={() => setSignAgreementVisible(false)}
      >
        <SignAgreementModal />
      </MultiModal>
    </>
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
