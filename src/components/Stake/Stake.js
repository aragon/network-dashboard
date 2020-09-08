import React from 'react'
import { Header } from '@aragon/ui'
import LayoutBox from '../Layout/LayoutBox'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import SideBar from './SideBar'

const Stake = React.memo(function Stake() {
  return (
    <LayoutGutter
      css={`
        position: relative;
        z-index: 2;
      `}
    >
      <LayoutLimiter>
        <Header primary="Stake management" />
        <LayoutColumns
          primary={<LayoutBox primary />}
          secondary={<SideBar />}
        />
      </LayoutLimiter>
    </LayoutGutter>
  )
})

export default Stake
