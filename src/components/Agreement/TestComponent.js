import React from 'react'
import { useMultiModal } from '../MultiModal/MultiModalProvider'

function TestComponent() {
  const { next } = useMultiModal()

  return (
    <div>
      hello world <button onClick={() => next()}>Next</button>
    </div>
  )
}

export default TestComponent
