import React from 'react'
import { Field, GU } from '@aragon/ui'
import PropTypes from 'prop-types'

function InfoField({ label, children, ...props }) {
  return (
    <Field
      label={label}
      {...props}
      css={`
        margin-bottom: 0;
      `}
    >
      {/* Pass unused id to disable clickable label  */}
      {({ id }) => (
        <div
          css={`
            padding-top: ${0.5 * GU}px;
          `}
        >
          {children}
        </div>
      )}
    </Field>
  )
}

InfoField.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
}

export default InfoField
