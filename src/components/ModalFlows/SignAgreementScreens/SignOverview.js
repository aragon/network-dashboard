import React from 'react'
import PropTypes from 'prop-types'
import { Info, useLayout, GU } from '@aragon/ui'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import InfoField from './../../InfoField'
import ModalButton from '../ModalButton'
import signGraphic from '../../../assets/smart-contract.png'

function SignOverview({ onContinue }) {
  const { layoutName } = useLayout()
  const { next } = useMultiModal()

  const smallMode = layoutName === 'small'

  return (
    <>
      <img
        src={signGraphic}
        css={`
          display: block;
          width: auto;
          height: ${smallMode ? 17 * GU : 20 * GU}px;

          margin: auto;
          margin-bottom: ${5 * GU}px;
        `}
      />
      <InfoField label="Agreement action collateral">
        <p>
          In order perform or challenge actions bound by this Agreement, you
          must deposit some ANT as the action collateral first. Different apps
          might require different tokens and amounts as the action collateral.
          You can do this at any time on Stake Management.
        </p>
      </InfoField>
      <Info
        mode="info"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        These votes are purely informative and will not directly result in any
        further action being taken in the organization. These proposals can be
        challenged if not adhered to this organization’s Agreement.
      </Info>
      <ModalButton
        mode="strong"
        onClick={() => {
          onContinue(next)
        }}
      >
        Sign Agreement
      </ModalButton>
    </>
  )
}

SignOverview.propTypes = {
  onContinue: PropTypes.func.isRequired,
}

export default SignOverview
