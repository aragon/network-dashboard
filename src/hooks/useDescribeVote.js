import { useEffect, useState, useMemo } from 'react'
import { describeScript } from '@aragon/connect'
import { useAppState } from '../providers/AppState'
import { getAppPresentation } from '../utils/app-utils'
import { addressesEqual } from '../lib/web3-utils'

const cachedDescriptions = new Map([])

export function useDescribeVote(script, voteId) {
  const { organization } = useAppState()
  const { apps } = useAppState()
  const [description, setDescription] = useState(null)
  const [loading, setLoading] = useState(true)

  // TODO: This provider will be supplied to describeScript by default in a future connect release
  // https://github.com/aragon/connect/pull/223
  const provider = organization.connection.ethersProvider
  const emptyScript = script === '0x00000001'

  console.log(organization)

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
        const description = await describeScript(script, apps, provider)

        if (!cancelled) {
          setDescription(description)
          setLoading(false)

          // Cache vote description to avoid unnecessary future call
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
