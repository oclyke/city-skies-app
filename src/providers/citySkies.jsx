import React, {
  useMemo,
  createContext,
  useEffect,
  useContext,
  useRef,
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

export function useCitySkiesApi() {
  const context = useContext(CitySkiesApiContext);

  if (context === null) {
    throw new Error(NO_CONTEXT_ERROR_TEXT);
  }

  return context;
}
