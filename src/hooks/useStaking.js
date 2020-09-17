import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'
import { useOrgApps } from '../providers/OrgApps'
import { useWallet } from '../providers/Wallet'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { agreementApp } = useOrgApps()
  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStakingInformation() {
      try {
        if (account) {
          const defaultValues = {
            available: '0',
            challenged: '0',
            locked: '0',
            tokenDecimals: 1,
            total: '0',
          }

          const disputableApps = await agreementApp.disputableApps()
          const allRequirements = await Promise.all(
            disputableApps.map((app) => app.collateralRequirement())
          )
          const allTokens = await Promise.all(
            allRequirements.map((collateral) => collateral.token())
          )

          const staking = await agreementApp.staking(
            allTokens[0].id,
            '0x0090aed150056316e37fe6dfa10dc63e79d173b6'
          )
          const stakingMovements = await agreementApp.stakingMovements(
            allTokens[0].id,
            '0x0090aed150056316e37fe6dfa10dc63e79d173b6'
          )

          if (mounted()) {
            setStakeManagement({
              token: allTokens[0],
              staking: staking ? staking : defaultValues,
              stakingMovements: stakingMovements,
            })

            setLoading(false)
          }
        } else {
          setStakeManagement(null)
          setLoading(false)
        }
      } catch (err) {
        setStakeManagement({
          staking: {
            available: '0',
            challenged: '0',
            locked: '0',
            tokenDecimals: 1,
            total: '0',
          },
          stakingMovements: null,
        })
        setLoading(false)
        console.error(err)
      }
    }

    if (agreementApp && account) {
      getStakingInformation()
    }
  }, [agreementApp, mounted, account])

  return [stakeManagement, loading]
}
