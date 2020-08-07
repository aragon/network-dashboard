import env from '../environment'

function useChainId() {
  return env('CHAIN_ID')
}

export default useChainId
