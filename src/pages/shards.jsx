import React, {
  useMemo,
} from 'react';

import {
  Text,
  View,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  useConnectionState,
} from 'src/providers/connection';

import {
  usePath,
} from 'src/providers/citySkies';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default function Shards() {
  const {
    address,
  } = useConnectionState();

  // console.log('using address: ', address)

  const [{
    stacks: {
      active,
    },
  }, outputLoading] = usePath('/api/v0/output', { stacks: { active: 'A' } });
  const [shards, shardsLoading] = usePath('/api/v0/shards');

  const endpoint = `http://${address}/api/v0/output/stack/${active}/layer`;

  const postShard = useMemo(() => (
    (shardId) => {
      console.log('posting shard id to active stack: ', shardId);
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          shard_uuid: shardId,
        }),
      })
        .catch(console.error);
    }), [endpoint]);

  if ((outputLoading === true) || (shardsLoading === true)) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    edges,
  } = shards;
  const modules = edges.map((edge) => edge.cursor).map((filename) => filename.replace(/\.[^/.]+$/, ''));

  return (
    <>
      <Text>Shards Page</Text>
      <ScrollView style={styles.container}>
        {modules.map((shard) => (
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
