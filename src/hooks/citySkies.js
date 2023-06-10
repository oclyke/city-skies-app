import {
  useMemo,
  useState,
  useEffect,
} from 'react';

import {
  useCitySkiesState,
  useCitySkiesApi,
} from 'src/providers/citySkies';

export function useInstanceConnection() {
  const {
    address,
    connected,
    // instance,
  } = useCitySkiesState();
  const {
    setAddress,
    resetAddress,
  } = useCitySkiesApi();

  return {
    address,
    connected,
    setAddress,
    resetAddress,
  };
}

export function useInstanceData(path) {
  const { instance } = useCitySkiesState();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const listener = useMemo(() => (
    (key, value) => {
      setData(value);
      setLoading(false);
    }), []);

  // subscribe to the cache and get initial data
  useEffect(() => {
    instance.cache.subscribe(path, listener);

    // use the cached data on the instance
    instance.get(path)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);

    return function cleanup() {
      instance.cache.unsubscribe(path);
    };
  }, [path]);

  return [data, loading];
}
