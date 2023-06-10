import React, {
  useMemo,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const NO_CONTEXT_ERROR_TEXT = 'No CitySkiesContext found. Use CitySkiesProvider.';

const CitySkiesStateContext = createContext(null);
const CitySkiesApiContext = createContext(null);

export default function CitySkiesProvider({ children, instance, defaultAddress }) {
  // memoized API allows API consumers not to re-render on state change
  // eslint-disable-next-line arrow-body-style
  const api = useMemo(() => {
    return {
      // no api yet
    };
  }, []);

  // assemble a memoized state
  const state = useMemo(() => ({
    instance,
    defaultAddress,
  }), [instance, defaultAddress]);

  return (
    <CitySkiesStateContext.Provider value={state}>
      <CitySkiesApiContext.Provider value={api}>
        { children }
      </CitySkiesApiContext.Provider>
    </CitySkiesStateContext.Provider>
  );
}

export function useCitySkiesState() {
  const context = useContext(CitySkiesStateContext);

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
