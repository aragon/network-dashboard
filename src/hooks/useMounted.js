import { useEffect, useRef } from 'react'

// Simple hook for checking a component is mounted prior to an async state update
export function useMounted() {
  const mounted = useRef(true)

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  return () => mounted.current
}
