import { getNetworkName } from './lib/web3-utils'
import { networkEnvironment } from './current-environment'

export const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

export class ProposalNotFound extends Error {
  name = 'ProposalNotFound'
  constructor(proposalId) {
    super(
      `It looks like proposal #${proposalId} doesn't exist on the ${getNetworkName(
        networkEnvironment.chainId
      )} network.`
    )
    this.proposalId = proposalId
  }
}
