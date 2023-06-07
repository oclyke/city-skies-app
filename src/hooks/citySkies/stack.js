import {
  useState,
  useEffect,
} from 'react';

import {
  useCitySkiesInstance,
} from 'src/providers/citySkies';

export default function useStack(id) {
  const {
    connection: {
      address,
      connected,
    },
    cache,
  } = useCitySkiesInstance();

  const [state, setState] = useState({
    layers: {
      count: 0,
      ids: [],
    },
  });

  // handle changed context
  useEffect(() => {
    // check for connection
    if (connected !== true) {
      return;
    }

    // update layers info
    const path = `/stacks/${id}/layers_connection`;
    const endpoint = `http://${address}${path}`;
    fetch(endpoint, { method: 'GET' })
      .then((r) => r.text())
      .then(JSON.parse)
      .then((obj) => {
        cache.store(path, obj);
        const {
          total,
          edges,
        } = obj;

        // get the ids
        const ids = edges.map((edge) => edge.node.id);

        setState((prev) => ({
          ...prev,
          layers: {
            count: total,
            ids,
          },
        }));
      })
      .catch(console.error);
  }, [connected, address, id]);

  return state;
}
