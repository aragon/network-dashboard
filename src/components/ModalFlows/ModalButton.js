import styled from 'styled-components'
import { Button, GU } from '@aragon/ui'

const ModalButton = styled(Button).attrs({
  mode: 'strong',
  wide: true,
})`
  margin-top: ${2 * GU}px;
`

export default ModalButton
