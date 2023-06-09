import React, {
  useMemo,
  createContext,
  useEffect,
  useContext,
  useRef,
  useState,
} from 'react';

import {
  useConnectionState,
} from 'src/providers/connection';

import KVStore from 'src/lib/cache';

const NO_CONTEXT_ERROR_TEXT = 'No CitySkiesContext found. Use CitySkiesProvider.';

const CitySkiesInstanceContext = createContext(null);
const CitySkiesApiContext = createContext(null);

/**
 * Creates a CitySkiesApi
 * @returns The CitySkiesApi.
 */
function apiFactory() {
  function reload() {
    console.warn('not implemented');
  }

  return {
    reload,
  };
}

export default function CitySkiesProvider({ children }) {
  // rely on the provided connection
  const {
    address,
    connected,
  } = useConnectionState();

  // create a cache to store information about api endpoints
  const { current: cache } = useRef(new KVStore());

  // memoized API allows API consumers not to re-render on state change
  const api = useMemo(
    () => apiFactory(),
    [],
  );

  useEffect(() => {
    // clear the cache when the connection address changes
    cache.clear();
  }, [address]);

  // assemble a memoized state
  const state = useMemo(() => ({
    cache,
    connection: {
      address,
      connected,
    },
  }), [
    cache,
    address,
    connected,
  ]);

  return (
    <CitySkiesInstanceContext.Provider value={state}>
      <CitySkiesApiContext.Provider value={api}>
        { children }
      </CitySkiesApiContext.Provider>
    </CitySkiesInstanceContext.Provider>
  );
}

export function useCitySkiesInstance() {
  const context = useContext(CitySkiesInstanceContext);

  if (context === null) {
    throw new Error(NO_CONTEXT_ERROR_TEXT);
  }

  return context;
}

/**
 * Returns the data for a given path on a city skies instance
 */
export function usePath(path, initializer) {
  const {
    cache,
    connection: {
      address,
      connected,
    },
  } = useCitySkiesInstance();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(initializer);

  // construct the endpoint that will be used to access the data for this instance
  const endpoint = `http://${address}${path}`;

  const refresh = useMemo(() => (
    () => {
      if (connected === false) {
        return Promise.reject(new Error('disconnected'));
      }
      return new Promise((resolve, reject) => {
        console.log('fetching ', endpoint);
        fetch(endpoint, { method: 'GET' })
          .then((r) => r.text())
          .then((t) => JSON.parse(t))
          .then((data) => {
            resolve(data);
          })
          .catch(reject);
      });
    }), [endpoint, connected]);

  // get initial data
  useEffect(() => {
    // mark invalid
    setLoading(true);

    // get data
    cache.get(path)
      .then((value) => {
        setState(value);
        setLoading(false);
      })
      .catch(async () => {
        console.log('cache missed path: ', path);
        try {
          const data = await refresh();
          setState(data);
          setLoading(false);
          cache.store(path, data);
        } catch {
          console.log('failed to update path: ', path);
        }
      });
  }, [path, connected]);

  return [state, loading, refresh];
}

export function useCitySkiesApi() {
  const context = useContext(CitySkiesApiContext);

  if (context === null) {
    throw new Error(NO_CONTEXT_ERROR_TEXT);
  }

  return context;
}
