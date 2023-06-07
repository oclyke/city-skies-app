import React, {
  useMemo,
  createContext,
  useEffect,
  useReducer,
  useContext
} from 'react';

import {
  useConnectionState,
} from 'src/providers/connection';

import {
  Instance as CitySkiesInstance,
} from 'src/lib/citySkies';

const NO_CONTEXT_ERROR_TEXT = 'No CitySkiesContext found. Use CitySkiesProvider.';

const CitySkiesInstanceContext = createContext(null);
const CitySkiesApiContext = createContext(null);

/*
state: {
  address: "address of connection",
  shards: [

  ],
  stacks: {
    active: {

    },
    inactive: {

    },
  }

}
*/

function reducer(state, action) {
  switch (action.type) {
    case 'replace': {
      return {
        ...action.nextState,
      };
    }
    default: {
      console.error(`unrecognized action type: "${action.type}". No changes applied.`);
      return state;
    }
  }
}

/**
 * Creates a CitySkiesApi
 * @param {*} setState The dispatch used to change the CitySkiesInstance.
 * @returns The CitySkiesApi.
 */
function apiFactory(dispatch) {
  function reload() {
    console.warn('not implemented');
  }

  return {
    reload,
  };
}

export default function CitySkiesProvider({ children }) {
  const { address } = useConnectionState();
  const [state, dispatch] = useReducer(reducer, new CitySkiesInstance());

  // memoized API allows API consumers not to re-render on state change
  const api = useMemo(() => apiFactory(dispatch), [dispatch]);

  // when the address changes perform change of address ritual
  // (this has bad code smell to me, but we don't expect to change address often so fine whatever)
  useEffect(() => {
    // getFullState(address)
    //   .then((nextState) => {
    //     dispatch({ type: 'replace', nextState });
    //   });

    console.warn('address has changed to ', address);

  }, [address]);

  console.log('render city skies provider');

  return (
    <CitySkiesInstanceContext.Provider value={state}>
      <CitySkiesApiContext.Provider value={api}>
        {children}
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
