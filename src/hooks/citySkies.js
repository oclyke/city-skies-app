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
    instance,
    defaultAddress,
  } = useCitySkiesState();
  const [state, setState] = useState({
    connected: instance.connected,
    address: instance.address,
  });

  const api = useMemo(() => ({
    setAddress: (addr) => {
      setState((prev) => ({ ...prev, address: addr }));
      instance.setAddress(addr);
    },
    resetAddress: () => {
      setState((prev) => ({ ...prev, address: defaultAddress }));
      instance.setAddress(defaultAddress);
    },
  }), [defaultAddress]);

  // subscribe to connection state changes
  // when the instance state changes, update the local state
  useEffect(() => {
    function listener(status) {
      setState(status);
    }
    instance.subscribeConnection(listener);
    return function cleanup() {
      instance.unsubscribeConnection(listener);
    };
  }, []);

  return {
    address: state.address,
    connected: state.connected,
    setAddress: api.setAddress,
    resetAddress: api.resetAddress,
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

export function useInstanceApi() {
  const api = useCitySkiesApi();
  return api;
}
