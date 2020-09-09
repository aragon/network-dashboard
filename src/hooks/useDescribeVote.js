import { useEffect, useState, useMemo } from 'react'
import { useOrganization } from '@aragon/connect-react'
import { useOrgApps } from '../providers/OrgApps'
import { getAppPresentation } from '../utils/app-utils'
import { addressesEqual } from '../lib/web3-utils'

const cachedDescriptions = new Map([])

export function useDescribeVote(script, voteId) {
  const [org] = useOrganization()
  const { apps } = useOrgApps()
  const [description, setDescription] = useState(null)
  const [loading, setLoading] = useState(true)

  const emptyScript = script === '0x00000001'

  // Populate target app data from transaction request
  const targetApp = useMemo(
    () =>
      description
        ? targetDataFromTransactionRequest(apps, description[0])
        : null,
    [apps, description]
  )

  useEffect(() => {
    if (emptyScript) {
      return
    }

    let cancelled = false

    // Return from cache if description was previously fetched
    if (cachedDescriptions.has(voteId)) {
      if (!cancelled) {
        setDescription(cachedDescriptions.get(voteId))
        setLoading(false)
      }

      return
    }

    async function describe() {
      try {
        const { describedSteps } = await org.describeScript(script)

        if (!cancelled) {
          setDescription(describedSteps)
          setLoading(false)

          // Cache vote description to avoid unnecessary future call
          cachedDescriptions.set(voteId, describedSteps)
        }
      } catch (err) {
        console.error(err)
      }
    }

    describe()

    return () => {
      cancelled = true
    }
  }, [emptyScript, script, voteId, org])

  return { description, emptyScript, loading, targetApp }
}

function targetDataFromTransactionRequest(apps, transactionRequest) {
  const { to: targetAppAddress, name, identifier } = transactionRequest

  // Populate details via our apps list if it's available
  if (apps.some(({ address }) => addressesEqual(address, targetAppAddress))) {
    const { humanName, iconSrc } = getAppPresentation(apps, targetAppAddress)
    return {
      address: targetAppAddress,
      name: humanName,
      icon: iconSrc,
    }
  }

  // Otherwise provide some fallback values
  return {
    address: targetAppAddress,
    name: name || identifier,
    icon: '',
  }
}
