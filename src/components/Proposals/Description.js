import React from 'react'
import { GU, IdentityBadge, useTheme } from '@aragon/ui'

/* eslint-disable react/prop-types */
function Description({ path }) {
  return (
    <span
      css={`
        // overflow-wrap:anywhere and hyphens:auto are not supported yet by
        // the latest versions of Safari (as of June 2020), which
        // is why word-break:break-word has been added here.
        hyphens: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
      `}
    >
      {path
        ? path.map((step, index) => <DescriptionStep key={index} step={step} />)
        : ''}
    </span>
  )
}

function DescriptionStep({ step }) {
  const theme = useTheme()

  const description = []

  if (step.descriptionAnnotated) {
    description.push(
      step.descriptionAnnotated.map(({ type, value }, index) => {
        const key = index + 1

        if (type === 'address' || type === 'any-account') {
          return (
            <span key={key}>
              {' '}
              <IdentityBadge
                compact
                entity={type === 'any-account' ? 'Any account' : value}
              />
            </span>
          )
        }

        if (type === 'role' || type === 'kernelNamespace' || type === 'app') {
          return <span key={key}> “{value.name}”</span>
        }

        if (type === 'apmPackage') {
          return <span key={key}> “{value.appName}”</span>
        }

        return <span key={key}> {value.description || value}</span>
      })
    )
  } else {
    description.push(
      <span key={description.length + 1}>
        {step.description || 'No description'}
      </span>
    )
  }
  description.push(<br key={description.lenth + 1} />)

  const childrenDescriptions = (step.children || []).map((child, index) => {
    return <DescriptionStep step={child} key={index} />
  })

  return (
    <>
      <span>{description}</span>
      {childrenDescriptions.length > 0 && (
        <ul
          css={`
            list-style-type: none;
            margin-left: 0;
            padding-left: ${0.5 * GU}px;
            text-indent: -${0.5 * GU}px;
          `}
        >
          <li
            css={`
              padding-left: ${2 * GU}px;
              &:before {
                content: '';
                width: ${0.5 * GU}px;
                height: ${0.5 * GU}px;
                background: ${theme.accent};
                border-radius: 50%;
                display: inline-block;
              }
              span {
                display: inline;
                color: ${theme.surfaceContentSecondary};
              }
            `}
          >
            {childrenDescriptions}
          </li>
        </ul>
      )}
    </>
  )
}
/* eslint-disable react/prop-types */

export default Description
