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
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(instance.address);

  console.log('city-skies-provider: ', address, instance.address, connected)

  // update the instance address when the connection state changes
  // subscribe to connection state changes
  useEffect(() => {
    function listener(connectionStatus) {
      setConnected(connectionStatus);
      console.log('connection state changed', connectionStatus);
    }
    instance.subscribeConnection(listener);
    return function cleanup() {
      instance.unsubscribeConnection(listener);
    };
  }, []);

  // memoized API allows API consumers not to re-render on state change
  const api = useMemo(() => {
    console.log('creating api');
    return {
      setAddress: (addr) => {
        instance.setAddress(addr);
        setAddress(addr);
      },
      resetAddress: () => {
        instance.setAddress(defaultAddress);
        setAddress(defaultAddress);
      },
    };
  }, [defaultAddress]);

  // assemble a memoized state
  const state = useMemo(() => ({
    instance,
    connected,
    address,
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
