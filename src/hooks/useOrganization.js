import { useEffect, useState } from 'react'
import { connect } from '@aragon/connect-react'
import { captureErrorWithSentry } from '../sentry'
import { networkEnvironment } from '../current-environment'

const ORG_SUBGRAPH_URL = networkEnvironment.subgraphs?.organization

export function useOrganzation() {
  const [organization, setOrganization] = useState(null)
  const [apps, setApps] = useState(null)
  const [loading, setLoading] = useState(true)

  const { chainId, orgLocation } = networkEnvironment

  useEffect(() => {
    let cancelled = false

    const fetchOrgWithApps = async () => {
      if (!cancelled) {
        setLoading(true)
      }
      try {
        const organization = await connect(orgLocation, 'thegraph', {
          network: chainId,
          orgSubgraphUrl: ORG_SUBGRAPH_URL,
        })

        const apps = await organization.apps()

        if (!cancelled) {
          setOrganization(organization)
          setApps(apps)
          setLoading(false)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        console.error(err)

        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchOrgWithApps()

    return () => {
      cancelled = true
    }
  }, [chainId, orgLocation])

  return { organization, apps, loading }
}
