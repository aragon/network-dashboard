import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Markdown, textStyle, useTheme, useLayout, GU } from '@aragon/ui'

function AgreementDocument({ content }) {
  const { layoutName } = useLayout()
  const theme = useTheme()
  const compactMode = layoutName === 'small'

  return (
    <Box padding={0}>
      <Article theme={theme} compact={compactMode}>
        <Markdown content={content} />
      </Article>
    </Box>
  )
}

const Article = styled.article`
  overflow-y: auto;
  max-height: ${100 * GU}px;
  padding: ${({ compact }) => `${compact ? 2 * GU : 7 * GU}px`};

  h1 {
    text-align: center;
    margin-top: ${4 * GU}px;
    margin-bottom: ${1 * GU}px;

    ${textStyle('title2')};
  }

  h2 {
    ${textStyle('title4')};
  }

  h3 {
    ${textStyle('body1')};
  }

  h4 {
    ${textStyle('body2')};
  }

  h2,
  h3,
  h4 {
    margin-top: ${4 * GU}px;
    margin-bottom: ${1 * GU}px;

    font-weight: 600;
  }

  p,
  li {
    margin-top: ${1 * GU}px;
    margin-bottom: ${2.5 * GU}px;
  }

  ul,
  ol {
    padding: 0;
    margin: ${2 * GU}px ${3 * GU}px;
  }

  ul {
    list-style: none;

    li::before {
      content: '•';
      color: ${({ theme }) => theme.accent};
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }

  /* Trim margin top / bottom to sit flush against container */
  h1,
  h2,
  h4,
  h4,
  p,
  ol,
  ul {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`

AgreementDocument.propTypes = {
  content: PropTypes.string.isRequired,
}

export default AgreementDocument
