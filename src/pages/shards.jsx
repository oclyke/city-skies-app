import React, { useMemo } from 'react';

import {
  Text,
  View,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

import useShards from 'src/hooks/shards';

import {
  useConnectionState,
} from 'src/providers/connection';
import useStackManager from 'src/hooks/citySkies/stackManager';

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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default function Shards() {
  const shards = useShards();
  const { address } = useConnectionState();
  const {
    active,
  } = useStackManager();

  const endpoint = `http://${address}/stacks/${active}/layer`;

  const postShard = useMemo(() => (
    (shardId) => {
      console.log('posting shardid to active stack: ', shardId);
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          shard_uuid: shardId,
        }),
      })
        .catch(console.error);
    }), [endpoint]);

  return (
    <>
      <Text>Shards Page</Text>
      <ScrollView style={styles.container}>
        {shards.map((shard) => (
          <React.Fragment key={shard}>
            <View>
              <Text>{shard}</Text>
              <Button
                title="add"
                onPress={() => postShard(shard)}
              />
            </View>
          </React.Fragment>
        ))}
      </ScrollView>
    </>
  );
}
