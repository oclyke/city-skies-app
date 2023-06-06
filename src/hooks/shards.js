import {
  useState,
  useEffect,
} from 'react';

import {
  useConnectionState,
} from 'src/providers/connection';

/**
 * Gets the names of all shards available on the target.
 * @param {*} address The socket address of the target.
 * @returns A promise which resolves to alist of all the shard names available on the target.
 */
function getShardNames(address) {
  return new Promise((resolve, reject) => {
    // get shards listing in the form:
    // {
    //   total: count,
    //   edges: [
    //     { cursor: "cursor", node: { name: "shard_name" }},
    //   ],
    //   pageInfo: {
    //     hasNextPage: boolean,
    //     lastCursor: "cursor"
    //   },
    // }

    fetch(`http://${address}/shards`, { method: 'GET' })
      .then((response) => response.text())
      // .then((response) => response.json())
      .then((j) => JSON.parse(j))
      .then(({ edges }) => {
        resolve(edges.map((edge) => edge.cursor));
      })
      .catch(reject);
  });
}

export default function useShards() {
  const {
    address,
  } = useConnectionState();
  const [shards, setShards] = useState([]);

  // get initial listing of shards
  useEffect(() => {
    getShardNames(address)
      .then((names) => setShards(names));
  }, [address]);

  return shards;
}
