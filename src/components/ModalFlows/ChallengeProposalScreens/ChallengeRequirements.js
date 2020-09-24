import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  formatTokenAmount,
  Field,
  TokenAmount,
  textStyle,
  useTheme,
  GU,
} from '@aragon/ui'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import { useSingleVote } from '../../../hooks/useSingleVote'

function ChallengeRequirements({ getTransactions }) {
  const theme = useTheme()
  const [{ collateral }] = useSingleVote()
  const { settlementPeriodHours, token, challengeAmount } = collateral

  const [argument, setArgument] = useState('')
  const [loading, setLoading] = useState(false)
  const { next } = useMultiModal()

  const maxChallengeAmount = useMemo(
    () => formatTokenAmount(challengeAmount, token.decimals),
    [challengeAmount, token.decimals]
  )

  const [settlementAmount, setSettlementAmount] = useState(maxChallengeAmount)

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
        <p>
          {settlementPeriodHours}{' '}
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Hours
          </span>
        </p>
      </InfoField>

      <Field
        label="Settlement offer"
        css={`
          margin-bottom: ${3.5 * GU}px;
        `}
      >
        <TextInput
          value={settlementAmount}
          min="1"
          max={maxChallengeAmount}
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
        <p
          css={`
            margin-top: ${1 * GU}px;
            color: ${theme.surfaceContentSecondary};
            ${textStyle('body3')};
          `}
        >
          This amount cannot be greater than the stake locked for the action
          submmission: {maxChallengeAmount} {token.symbol}.
        </p>
      </Field>

      <Field
        label="Argument in favour of cancelling action"
        css={`
          margin-bottom: 0px;
        `}
      >
        <TextInput
          multiline
          value={argument}
          wide
          onChange={handleArgumentChange}
          required
          css={`
            min-height: ${15 * GU}px;
          `}
        />
      </Field>
      <ModalButton mode="strong" type="submit" loading={loading}>
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
