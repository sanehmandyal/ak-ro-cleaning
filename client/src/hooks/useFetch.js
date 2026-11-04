import { useCallback, useEffect, useState } from 'react';
import { get, errorMessage } from '../services/api';

// Fetches `url` with `params`. `deps` should be a stable string/number key for the params.
export default function useFetch(url, params, key = '') {
  const [state, setState] = useState({ data: null, extra: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get(url, params)
      .then(({ data, ...extra }) => active && setState({ data, extra, loading: false, error: null }))
      .catch((err) => active && setState({ data: null, extra: null, loading: false, error: errorMessage(err) }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, key, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
