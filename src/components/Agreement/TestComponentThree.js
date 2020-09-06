import React from 'react'
import { useMultiModal } from '../MultiModal/MultiModalProvider'

function TestComponentTwo() {
  const { prev } = useMultiModal()

  return (
    <div>
      hello world <br /> hello world <br />
      hello world <br />
      hello world <br />
      hello world <br />
      hello world <br /> hello world <br />
      hello world <br />
      hello world <br />
      hello world <br />
      hello world <br /> hello world <br />
      hello world <br />
      hello world <br />
      hello world <br />
      hello world <br /> <button onClick={() => prev()}>Previous</button>
    </div>
  )
}

export default TestComponentTwo
