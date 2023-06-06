import React from 'react';

import {
  Text,
} from 'react-native';

import useShards from 'src/hooks/shards';

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
  const shards = useShards();

  return (
    <>
      <Text>Shards Page</Text>
      {shards.map((shard) => (
        <React.Fragment key={shard}>
          <Text>{shard}</Text>
        </React.Fragment>
      ))}
    </>
  );
}
