import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextInput, Field, TokenAmount, useTheme, GU } from '@aragon/ui'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import InfoField from '../../InfoField'
import { useSingleVote } from '../../../hooks/useSingleVote'

function ChallengeRequirements({ getTransactions }) {
  const theme = useTheme()
  const [{ collateral }] = useSingleVote()
  const [argument, setArgument] = useState('')
  const [settlementAmount, setSettlementAmount] = useState(10)
  const [loading, setLoading] = useState(false)
  const { next } = useMultiModal()

  const { settlementPeriodHours, token } = collateral

  console.log(collateral)

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setLoading(true)

      // Proceed to the next screen after transactions have been received
      getTransactions(() => {
        next()
      })
    },
    [getTransactions, next]
  )

  const handleArgumentChange = useCallback(({ target }) => {
    setArgument(target.value)
  }, [])

  const handleSettlementChange = useCallback(({ target }) => {
    setSettlementAmount(target.value)
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <InfoField
        label="Settlement period"
        css={`
          margin-top: ${1 * GU}px;
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <p>{settlementPeriodHours} Hours</p>
      </InfoField>
      <Field
        label="Settlement offer"
        css={`
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <div>
          <TextInput
            value={settlementAmount}
            min="1"
            max="10"
            wide
            type="number"
            adornment={
              <TokenAmount
                address={token.id}
                symbol={token.symbol}
                css={`
                  padding: ${0.5 * GU}px;
                  padding-right: ${1 * GU}px;
                  background-color: ${theme.surface};
                `}
              />
            }
            onChange={handleSettlementChange}
            adornmentPosition="end"
            adornmentSettings={{ padding: 0.5 * GU }}
            required
          />
        </div>
      </Field>
      <Field label="Argument in favour of cancelling action">
        <TextInput
          multiline
          value={argument}
          wide
          onChange={handleArgumentChange}
          required
        />
      </Field>
      <p
        css={`
          margin-top: ${2 * GU}px;
          margin-bottom: ${2.5 * GU}px;
        `}
      >
        You meet all the requirements to challenge this disputable action
      </p>
      <ModalButton mode="strong" loading={loading} type="submit">
        Create transaction
      </ModalButton>
    </form>
  )
}

// async function pinContent() {
//   const content = new Blob(['Hello world'], { type: 'text/markdown' })

//   console.log(content)

//   try {
//     const fileMeta = await client.upload(
//       '0xF9fc8d5e9d10B98cc40f7BE6BA603363b10FA292',
//       content,
//       'test.md'
//     )

//     console.log(fileMeta)
//   } catch (err) {
//     console.error(err)
//   }
// }

ChallengeRequirements.propTypes = {
  getTransactions: PropTypes.func,
}

export default ChallengeRequirements
