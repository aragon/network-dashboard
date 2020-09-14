import React, { useState } from 'react'
import { Button, Header } from '@aragon/ui'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import LoadingSection from '../Loading/LoadingSection'
import MultiModal from '../MultiModal/MultiModal'
import SignAgreementScreens from '../ModalFlows/SignAgreementScreens/SignAgreementScreens'
import { useAgreementState } from '../../providers/AgreementState'
import { useWallet } from '../../providers/Wallet'

const Agreement = React.memo(function Agreement() {
  const { account } = useWallet()
  const [signModalVisible, setSignModalVisible] = useState(false)
  const { agreement, loading } = useAgreementState()

  const signed = agreement.signed

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
                onClick={() => setSignModalVisible(true)}
              />
            }
          />
          <LoadingSection title="Loading agreement" loading={loading}>
            <AgreementLayout agreement={agreement} signedAgreement={signed} />
          </LoadingSection>
        </LayoutLimiter>
      </LayoutGutter>
      <MultiModal
        visible={signModalVisible}
        onClose={() => setSignModalVisible(false)}
      >
        <SignAgreementScreens />
      </MultiModal>
    </>
  )
})

/* eslint-disable react/prop-types */
function AgreementLayout({ agreement, signedAgreement }) {
  const {
    title,
    content,
    contractAddress,
    contentIpfsUri,
    effectiveFrom,
    stakingAddress,
    disputableApps,
  } = agreement

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
              signedAgreement={signedAgreement}
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
