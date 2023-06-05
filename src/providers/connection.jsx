import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const NO_CONTEXT_ERROR_TEXT = 'No ConnectionContext found. Use ConnectionProvider.';

const ConnectionStateContext = createContext(null);
const ConnectionApiContext = createContext(null);

/**
 * Tries the connection in state and indicates success or failure.
 * @param {*} state The ConnectionState used for the test.
 * @returns true for successful connection, else false.
 */
async function tryConnection(state) {
  try {
    await fetch(`http://${state.address}/info`, { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the ConnectionState with computed values.
 * @param {*} state The ConnectionState from which to compute values.
 * @returns
 */
function getComputedState(state) {
  const address = `${state.host}:${state.port}`;

  return {
    ...state,
    address,
  };
}

/**
 * Makes a ConnectionState given an initial ConnectionState by shallow merge.
 * @param {*} initial A partial ConnectionState.
 * @returns A complete ConnectionState computed from assumed values where others are not provided.
 */
function makeInitialConnectionState(initial) {
  const assumed = {
    host: '127.0.0.1',
    port: 1337,
  };

  if (typeof initial === 'undefined') {
    return assumed;
  }

  return getComputedState({
    ...assumed,
    ...initial,
    connected: false,
  });
}

/**
 * Creates a ConnectionApi given a ConnectionStateDispatch function.
 * @param {*} setState The dispatch used to change the ConnectionState.
 * called with the connectionReducer.
 * @returns The ConnectionApi.
 */
function connectionApiFactory(setState, initialState, storageKey) {
  function setHost(host) {
    setState((prev) => {
      const updated = getComputedState({ ...prev, host });
      AsyncStorage.setItem(storageKey, JSON.stringify(updated))
        .catch(console.error);
      return updated;
    });
  }

  function setPort(port) {
    setState((prev) => {
      const updated = getComputedState({ ...prev, port });
      AsyncStorage.setItem(storageKey, JSON.stringify(updated))
        .catch(console.error);
      return updated;
    });
  }

  function reset() {
    setState(() => {
      const updated = getComputedState(initialState);
      AsyncStorage.setItem(storageKey, JSON.stringify(updated))
        .catch(console.error);
      return updated;
    });
  }

  return {
    setHost,
    setPort,
    reset,
  };
}

/**
 * Provides ConnectionState and ConnectionApi to child components
 * @param {*} param0
 * @returns
 */
export default function ConnectionProvider({ children, initial, storageKey }) {
  const [initialState] = useState(() => makeInitialConnectionState(initial));
  const [state, setState] = useState(() => initialState);
  const [pingLoop, setPingLoop] = useState(null);

  // get the full AsyncStorage key for persisting connection information
  const key = `connection:${storageKey}`;

  // memoized API allows API consumers not to re-render on state change
  const api = useMemo(
    () => connectionApiFactory(setState, initialState, key),
    [setState, initialState, key],
  );

  // attempt to load persisted connection
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((value) => {
        if (value !== null) {
          setState(JSON.parse(value));
        } else {
          AsyncStorage.setItem(key, JSON.stringify(state))
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [key]);

  // periodically ping the connection to see if it is alive
  useEffect(() => {
    setPingLoop(setInterval(() => {
      tryConnection(state)
        .then((connected) => {
          setState((prev) => ({ ...prev, connected }));
        })
        .catch(console.error);
    }, 1500));

    return function cleanup() {
      clearInterval(pingLoop);
    };
  }, [setState, state]);

  return (
    <ConnectionStateContext.Provider value={state}>
      <ConnectionApiContext.Provider value={api}>
        {children}
      </ConnectionApiContext.Provider>
    </ConnectionStateContext.Provider>
  );
}

export function useConnectionState() {
  const context = useContext(ConnectionStateContext);

  if (context === null) {
    throw new Error(NO_CONTEXT_ERROR_TEXT);
  }

  return context;
}

export function useConnectionApi() {
  const context = useContext(ConnectionApiContext);

  if (context === null) {
    throw new Error(NO_CONTEXT_ERROR_TEXT);
  }

  return context;
}
