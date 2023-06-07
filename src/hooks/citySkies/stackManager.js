import {
  useState,
  useEffect,
} from 'react';

import {
  useCitySkiesInstance,
} from 'src/providers/citySkies';

export default function useStackManager() {
  const {
    connection: {
      address,
      connected,
    },
    cache,
  } = useCitySkiesInstance();

  const [state, setState] = useState({
    active: 'A',
    inactive: 'B',
    stacks: {
      count: 0,
      ids: [],
    },
  });

  useEffect(() => {
    // check for connection
    if (connected !== true) {
      return;
    }

    const path = '/stack_manager/info';
    const endpoint = `http://${address}${path}`;

    fetch(endpoint, { method: 'GET' })
      .then((r) => r.text())
      .then(JSON.parse)
      .then((obj) => {
        // cache this result
        cache.store(path, obj);

        const {
          active,
          stacks,
        } = obj;

        const inactive = (active === 'A') ? 'B' : 'A';

        setState((prev) => ({
          ...prev,
          active,
          inactive,
          stacks: {
            count: stacks.length,
            ids: stacks,
          },
        }));
      })
      .catch(console.error);
  }, [connected, address]);

  return state;
}
