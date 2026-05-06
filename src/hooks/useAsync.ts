/**
 * Async hook - Handle loading, error, and data states
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T = void> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  dependencies?: React.DependencyList;
}

/**
 * Use async hook for handling async operations
 */
export const useAsync = <T>(
  fn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): AsyncState<T> & { retry: () => void } => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fn();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        options.onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error });
        options.onError?.(error);
      }
    }
  }, [fn, options]);

  useEffect(() => {
    execute();
    return () => {
      isMountedRef.current = false;
    };
  }, options.dependencies || []);

  return { ...state, retry: execute };
};
