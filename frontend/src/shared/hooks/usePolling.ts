import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (error: Error) => void;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
) {
  const { enabled = true, interval = 30000, onError } = options;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    if (!isMountedRef.current || !enabled) return;
    
    abortControllerRef.current = new AbortController();
    try {
      await fetchFn();
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        onError?.(error);
      }
    }
  }, [fetchFn, enabled, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (enabled) {
      execute();
      intervalRef.current = setInterval(execute, interval);
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, execute, interval]);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!intervalRef.current && enabled) {
      execute();
      intervalRef.current = setInterval(execute, interval);
    }
  }, [execute, enabled, interval]);

  return { refresh, stop, start };
}