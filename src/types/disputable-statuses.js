export const VOTE_ACCEPTED = Symbol('VOTE_ACCEPTED')
export const VOTE_CANCELLED = Symbol('VOTE_CANCELLED')
export const VOTE_CHALLENGED = Symbol('VOTE_CHALLENGED')
export const VOTE_DISPUTED = Symbol('VOTE_DISPUTED')
export const VOTE_EXECUTED = Symbol('VOTE_EXECUTED')
export const VOTE_REJECTED = Symbol('VOTE_REJECTED')
export const VOTE_SCHEDULED = Symbol('VOTE_SCHEDULED')
export const VOTE_SETTLED = Symbol('VOTE_SETTLED')

export const DisputableStatusType = {
  Accepted: VOTE_ACCEPTED,
  Cancelled: VOTE_CANCELLED,
  Challenged: VOTE_CHALLENGED,
  Disputed: VOTE_DISPUTED,
  Executed: VOTE_EXECUTED,
  Rejected: VOTE_REJECTED,
  Scheduled: VOTE_SCHEDULED,
  Settled: VOTE_SETTLED,
}
