import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Surface,
  Button,
  Text,
} from 'react-native-paper';

import {
  useInstanceApi,
  useInstanceOutputStackLayer,
} from 'src/hooks/citySkies';

const styles = StyleSheet.create({
  surface: {
    borderRadius: 10,
    padding: 5,
  },
});

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
      <Text>{`shard: ${shardId}`}</Text>
      <Text>{`id: ${id}`}</Text>
      <Text>{`index: ${index}`}</Text>
      <Text>{`active: ${active}`}</Text>
      <Text>{`local palette: ${useLocalPalette}`}</Text>
    </View>
  );
}

export function LayerViewStack({ stackId, id }) {
  const [, {
    removeOutputStackLayer,
  }] = useInstanceApi();
  const [data, loading] = useInstanceOutputStackLayer(stackId, id);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    config: {
      shard_uuid: shardId,
    },
  } = data;

  return (
    <Surface elevation={2} style={styles.surface}>

      {/* allow for two columns */}
      <View style={{ flexDirection: 'row' }}>

        {/* column 1 */}
        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
          <Text>{shardId}</Text>
        </View>

        {/* column 2 */}
        <View style={{ flexDirection: 'column', height: '100%'}}>
          <View style={{ flexDirection: 'row' }}>

            <Button
              icon="delete"
              onPress={() => {
                removeOutputStackLayer(stackId, id)
                  .then(() => console.log('successfully removed layer', id))
                  .catch(console.error);
              }}
            />

          </View>
        </View>
      </View>
    </Surface>
  );
}
