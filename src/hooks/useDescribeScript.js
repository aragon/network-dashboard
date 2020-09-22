import { useEffect, useState, useMemo } from 'react'
import { getAppPresentation } from '../utils/app-utils'
import { addressesEqual } from '../lib/web3-utils'
import { useMounted } from '../hooks/useMounted'
import { useOrgApps } from '../providers/OrgApps'

const cachedDescriptions = new Map([])

export function useDescribeScript(script, key) {
  const mounted = useMounted()
  const { apps, org } = useOrgApps()
  const [description, setDescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

    // Return from cache if description was previously fetched
    if (cachedDescriptions.has(key)) {
      if (mounted()) {
        setDescription(cachedDescriptions.get(key))
        setLoading(false)
      }

      return
    }

    async function getDescribedSteps() {
      try {
        const described = await org.describeScript(script)

        // Cache vote description to avoid unnecessary future call
        cachedDescriptions.set(key, described.describedSteps)

        if (mounted()) {
          setDescription(described.describedSteps)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)

        if (mounted()) {
          setError(err)
          setLoading(false)
        }
      }
    }

    getDescribedSteps()
  }, [script, key, org, mounted, emptyScript])

  return {
    description,
    targetApp,
    status: {
      loading,
      error,
      emptyScript,
    },
  }
}

function targetDataFromTransactionRequest(apps, transactionRequest) {
  const { to: targetAppAddress, name, identifier } = transactionRequest

  const targetApp = apps.find(({ address }) =>
    addressesEqual(address, targetAppAddress)
  )

  // Populate details via our apps list if it's available
  if (targetApp) {
    const { humanName, iconSrc } = getAppPresentation(targetApp)
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
