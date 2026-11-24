import { useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'idle' | 'loading'; value?: undefined; error?: undefined }
  | { status: 'success'; value: T; error?: undefined }
  | { status: 'error'; value?: undefined; error: unknown };

/** Runs `fn` whenever `key` changes. Pass `null` to skip. */
export function useAsync<T>(key: string | null, fn: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  useEffect(() => {
    if (key === null) return;
    let alive = true;
    setState({ status: 'loading' });
    fn().then(
      (value) => alive && setState({ status: 'success', value }),
      (error: unknown) => alive && setState({ status: 'error', error }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` identifies the request
  }, [key]);
  return state;
}
