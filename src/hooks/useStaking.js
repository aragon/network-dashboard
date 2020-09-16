import { useEffect, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { captureErrorWithSentry } from '../sentry'
import { getIpfsCidFromUri, ipfsGet } from '../lib/ipfs-utils'
import { toMs } from '../utils/date-utils'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { apps, agreementApp, appsLoading } = useOrgApps()
  const [staking, setStaking] = useState({})
  const [stakingLoading, setStakingLoading] = useState(true)

  const canProcess = !appsLoading && agreementApp

  useEffect(() => {
    async function getStakingInformation() {
      try {
        const [staking, stakingMovements] = await Promise.all([
          agreementApp.staking(
            '0x9a8eab8a356b8af4fa6ea5be983539ce97a258fb',
            account
          ),
          agreementApp.staking(
            '0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42',
            account
          ),
        ])

        if (mounted()) {
          setStaking({
            staking: staking,
            stakingCollateral: stakingMovements,
          })
          setStakingLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)
      }
    }

    if (canProcess && account) {
      getStakingInformation()
    }
  }, [apps, agreementApp, canProcess, mounted, account])

  return [staking, stakingLoading]
}
