import React, {
  useMemo,
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';

import {
  useConnectionState,
} from 'src/providers/connection';

import CitySkiesInterface from 'src/lib/citySkies/interface';

const NO_CONTEXT_ERROR_TEXT = 'No CitySkiesContext found. Use CitySkiesProvider.';

const CitySkiesStateContext = createContext(null);
const CitySkiesApiContext = createContext(null);

export default function CitySkiesProvider({ children, instance }) {
  const { address } = useConnectionState();
  const [connected, setConnected] = useState(false);

  // update the instance address when the connection state changes
  // subscribe to connection state changes
  useEffect(() => {
    instance.setAddress(address);

    function listener(connectionStatus) {
      setConnected(connectionStatus);
      console.log('connection state changed', connectionStatus);
    }

    instance.subscribeConnection(listener);

    return function cleanup() {
      instance.unsubscribeConnection(listener);
    };
  }, [address]);

  // memoized API allows API consumers not to re-render on state change
  const api = useMemo(() => {
    console.log('creating api');
    return {
      
    };
  }, [address]);

  // assemble a memoized state
  const state = useMemo(() => ({
    instance,
  }), [instance]);

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
