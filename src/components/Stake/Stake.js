import React from 'react'
import { Header } from '@aragon/ui'
import { useStakingState } from '../../providers/Staking'
import EmptyState from './EmptyState'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import SideBar from './SideBar'
import StakingMovements from './StakingMovements'
import noAccount from './assets/noAccount.svg'

const Stake = React.memo(function Stake() {
  const { stakeManagement } = useStakingState()

  if (!stakeManagement) {
    return (
      <LayoutGutter>
        <LayoutLimiter>
          <Header primary="Stake Management" />
          <EmptyState
            icon={noAccount}
            title="Enable your account"
            paragraph="Connect to an Ethereum provider to access your staking data. You may be temporarily redirected to a new screen."
          />
        </LayoutLimiter>
      </LayoutGutter>
    )
  }

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Stake management" />
        <LayoutColumns
          primary={
            stakeManagement.stakingMovements ? (
              <StakingMovements
                stakingMovements={stakeManagement.stakingMovements}
                token={stakeManagement.token}
              />
            ) : (
              <EmptyState
                icon={noAccount}
                title="No transactions yet"
                paragraph="You can start by depositing some ANT into the staking pool before you can submit a proposal."
              />
            )
          }
          secondary={
            <SideBar
              staking={stakeManagement.staking}
              token={stakeManagement.token}
            />
          }
          inverted
        />
      </LayoutLimiter>
    </LayoutGutter>
  )
})

export default Stake
