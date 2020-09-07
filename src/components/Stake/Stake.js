import React, { useCallback, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutBox from '../Layout/LayoutBox'

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
          primary={<LayoutBox primary></LayoutBox>}
          secondary={<LayoutBox primary></LayoutBox>}
        />
      </LayoutLimiter>
    </LayoutGutter>
  )
})

export default Stake
