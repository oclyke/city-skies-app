import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Text,
} from 'react-native';

import {
  useConnectionState,
} from 'src/providers/connection';

/*
shards are programs which can be run in a layer
the user can search shards and use them to add layers

shard: {
  name: "string",
}

*/

// function getShards (host) {
//   return fetch(`http://${host}/shards`, { method: 'GET' })
//     .then((response) => {
//       console.log(response);
//     });
// }

export default function Shards() {
  const {
    address,
  } = useConnectionState();
  const [shards, setShards] = useState([]);

  // get initial listing of shards
  useEffect(() => {
    console.log('getting shards');
    console.log(`http://${address}/shards`);
    fetch(`http://${address}/shards`, { method: 'GET' })
      .then((response) => {
        console.log('got response: ', response);
      })
      .catch(console.error);
  }, []);

  return (
    <Text>Shards Page</Text>

  );
}
