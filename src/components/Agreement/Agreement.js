import React, { useState } from 'react'
import { Box, Button, Header, Split } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import AgreementBindingActions from './AgreementBindingActions'
import AgreementHeader from './AgreementHeader'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import LoadingSection from '../Loading/LoadingSection'
import { useAgreement } from '../../providers/Agreement'
import MultiModal from '../MultiModal/MultiModal'
import TestComponent from './TestComponent'
import TestComponentTwo from './TestComponentTwo'
import TestComponentThree from './TestComponentThree'

const screens = [
  {
    title: 'New proposal',
    graphicHeader: true,
    content: <TestComponent />,
  },
  {
    title: 'hello2',
    width: 800,
    content: <TestComponentTwo />,
  },
  {
    title: 'hello3',
    content: <TestComponentThree />,
  },
]

const Agreement = React.memo(function Agreement() {
  const [modalVisible, setModalVisible] = useState(true)
  const { agreementDetails, loading } = useAgreement()

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
                onClick={() => {
                  setModalVisible(true)
                }}
              />
            }
          />
          <LoadingSection title="Loading agreement" loading={loading}>
            <AgreementLayout agreementDetails={agreementDetails} />
          </LoadingSection>
        </LayoutLimiter>
      </LayoutGutter>
      <MultiModal
        visible={modalVisible}
        screens={screens}
        onClose={() => setModalVisible(false)}
      />
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
    <>
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
    </>
  )
}
/* eslint-enable react/prop-types */

export default Agreement
