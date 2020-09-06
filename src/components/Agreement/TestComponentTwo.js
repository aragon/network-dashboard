import React from 'react'
import { useMultiModal } from '../MultiModal/MultiModalProvider'

function TestComponentTwo() {
  const { next, prev } = useMultiModal()

  return (
    <div>
      hello world <br /> hello world <br />
      hello world <br />
      hello world <br />
      hello world <br />
      hello world <br />
      <button onClick={() => prev()}>Previous</button>
      <button onClick={() => next()}>Next</button>{' '}
    </div>
  )
}

export default TestComponentTwo
