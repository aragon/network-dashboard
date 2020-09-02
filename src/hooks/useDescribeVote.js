import { useEffect, useState, useMemo } from 'react'
import { describeScript } from '@aragon/connect'
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

  const provider = org.connection.ethersProvider
  const emptyScript = script === '0x00000001'

  // Populate target app data from description
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

    // Return early from cache if description is already available
    if (cachedDescriptions.has(voteId)) {
      if (!cancelled) {
        setDescription(cachedDescriptions.get(voteId))
        setLoading(false)
      }

      return
    }

    async function describe() {
      try {
        const description = await describeScript(script, apps, provider)

        if (!cancelled) {
          setDescription(description)
          setLoading(false)

          // Cache vote description to avoid additional calls
          cachedDescriptions.set(voteId, description)
        }
      } catch (err) {
        console.error(err)
      }
    }

    describe()

    return () => {
      cancelled = true
    }
  }, [apps, emptyScript, provider, script, voteId])

  return { description, emptyScript, loading, targetApp }
}

function targetDataFromTransactionRequest(apps, transactionRequest) {
  const { to: targetAppAddress, name, identifier } = transactionRequest

  // Populate via known org apps if we know about it
  if (apps.some(({ address }) => addressesEqual(address, targetAppAddress))) {
    const { humanName, iconSrc } = getAppPresentation(apps, targetAppAddress)
    return {
      address: targetAppAddress,
      name: humanName,
      icon: iconSrc,
    }
  }

  // Otherwise provide the information we can
  return {
    address: targetAppAddress,
    name: name || identifier,
    icon: '',
  }
}
