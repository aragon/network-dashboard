import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Link } from '@aragon/ui'

function InternalLink({ to, children, ...props }) {
  const history = useHistory()

  const handlePageRequest = useCallback(() => {
    history.push(to)
  }, [history, to])

  return (
    <Link onClick={handlePageRequest} {...props}>
      {children}
    </Link>
  )
}

InternalLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
}

export default InternalLink
