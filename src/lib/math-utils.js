export function round(num, decimals = 2) {
  const rounded = Number(Math.round(num + 'e+' + decimals) + 'e-' + decimals)
  return Number.isNaN(rounded) ? Number(num.toFixed(decimals)) : rounded
}

// Return 0 if denominator is 0 to avoid NaNs
export function safeDiv(num, denom) {
  return denom ? num / denom : 0
}
