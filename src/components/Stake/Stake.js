import React from 'react'
import { Header } from '@aragon/ui'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import SideBar from './SideBar'
import { useStakingState } from '../../providers/Staking'

const Stake = React.memo(function Stake() {
  const { staking, loading } = useStakingState()
  console.log('delf', staking, loading)
  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Stake management" />
        <LayoutColumns
          primary={<LayoutBox primary />}
          secondary={<SideBar />}
          inverted
        />
      </LayoutLimiter>
    </LayoutGutter>
  )
})

export default Stake
