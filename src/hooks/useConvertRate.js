import { useEffect, useState, useRef } from 'react'

const CONVERT_API_RETRY_DELAY = 2 * 1000
const CONVERT_API_RETRY_DELAY_MAX = 60 * 1000

function convertRateUrl(symbolsQuery) {
  return `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${symbolsQuery}`
}

export function useConvertRate(symbol) {
  const [rate, setRate] = useState(null)
  const retryDelay = useRef(CONVERT_API_RETRY_DELAY)

  useEffect(() => {
    let cancelled = false
    let retryTimer = null

    const update = async () => {
      if (!symbol) {
        setRate(null)
        return
      }

      try {
        const response = await fetch(convertRateUrl(symbol))
        const rate = await response.json()
        if (!cancelled) {
          setRate(rate[symbol])
          retryDelay.current = CONVERT_API_RETRY_DELAY
        }
      } catch (err) {
        if (!cancelled) {
          // Add more delay after every failed attempt
          retryDelay.current = Math.min(
            CONVERT_API_RETRY_DELAY_MAX,
            retryDelay.current * 1.2
          )
          retryTimer = setTimeout(update, retryDelay.current)
        }
      }
    }
    update()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
      retryDelay.current = CONVERT_API_RETRY_DELAY
    }
  }, [symbol])

  return rate
}
