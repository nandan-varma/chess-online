/**
 * Debounce hook - Debounce value changes and callbacks
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Debounce a value - useful for search inputs and expensive operations
 */
export const useDebounce = <T>(value: T, delayMs: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
};

/**
 * Debounce a callback function
 */
export const useDebouncedCallback = <
  T extends (...args: unknown[]) => void | Promise<void>,
>(
  callback: T,
  delayMs: number = 500
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: unknown[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delayMs);
  }) as T;

  return debouncedCallback;
};
