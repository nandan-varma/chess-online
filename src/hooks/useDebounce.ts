/**
 * Debounce hook - Debounce value changes
 */

import { useEffect, useState } from 'react'

/**
 * Debounce a value - useful for search inputs and expensive operations
 */
export const useDebounce = <T,>(value: T, delayMs: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => clearTimeout(handler)
  }, [value, delayMs])

  return debouncedValue
}

/**
 * Debounce a callback function
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delayMs: number = 500
): ((...args: Parameters<T>) => void) => {
  const [lastCall, setLastCall] = useState<NodeJS.Timeout | null>(null)

  return (...args: Parameters<T>) => {
    if (lastCall) clearTimeout(lastCall)

    const newCall = setTimeout(() => {
      callback(...args)
    }, delayMs)

    setLastCall(newCall)
  }
}
