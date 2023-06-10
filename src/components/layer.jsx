import React from 'react';

import {
  View,
  Text,
} from 'react-native';

export function LayerConfig({ config }) {
  const {
    active,
    id,
    index,
    shard_uuid: shardId,
    use_local_palette: useLocalPalette,
  } = config;

  return (
    <View>
      <Text>Info:</Text>
      <Text>{`index: ${index}`}</Text>
      <Text>{`id: ${id}`}</Text>
      <Text>{`active: ${active}`}</Text>
      <Text>{`shard: ${shardId}`}</Text>
      <Text>{`local palette: ${useLocalPalette}`}</Text>
    </View>
  );
}
