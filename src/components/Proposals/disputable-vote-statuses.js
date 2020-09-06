export const VOTE_STATUS_ACCEPTED = Symbol('VOTE_STATUS_ACCEPTED')
export const VOTE_STATUS_ACTIVE = Symbol('VOTE_STATUS_ACTIVE')
export const VOTE_STATUS_CANCELLED = Symbol('VOTE_STATUS_CANCELLED')
export const VOTE_STATUS_DISPUTED = Symbol('VOTE_STATUS_DISPUTED')
export const VOTE_STATUS_PAUSED = Symbol('VOTE_STATUS_PAUSED')
export const VOTE_STATUS_EXECUTED = Symbol('VOTE_STATUS_EXECUUTED')
export const VOTE_STATUS_REJECTED = Symbol('VOTE_STATUS_REJECTED')
export const VOTE_STATUS_SETTLED = Symbol('VOTE_STATUS_SETTLED')

export const DISPUTABLE_VOTE_STATUSES = new Map([
  ['Scheduled', VOTE_STATUS_ACTIVE],
  ['Challenged', VOTE_STATUS_PAUSED],
  ['Cancelled', VOTE_STATUS_CANCELLED],
  ['Executed', VOTE_STATUS_EXECUTED],
  ['Disputed', VOTE_STATUS_DISPUTED],
  ['Accepted', VOTE_STATUS_ACCEPTED],
  ['Rejected', VOTE_STATUS_REJECTED],
  ['Settled', VOTE_STATUS_SETTLED],
])
