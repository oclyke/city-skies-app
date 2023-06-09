import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';

import Variable from 'src/components/variable';

import {
  usePath,
} from 'src/providers/citySkies';

import {
  useConnectionState,
} from 'src/providers/connection';

function deleteLayer(path) {
  return fetch(path, {
    method: 'DELETE',
  });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    margin: 5,
  },
});

function LayerInfo({ path }) {
  const [data, loading] = usePath(path);

  if (loading) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    // variables,
    // privateVariables,
    config: {
      active,
      id,
      index,
      shard_uuid: shardId,
      use_local_palette: useLocalPalette,
    },
  } = data;

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

export default function Layer({ path }) {
  const { address } = useConnectionState();
  const [data, loading] = usePath(path);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    config,
    variables: {
      // total: totalVariables,
      ids: variableIds,
    },
    privateVariables: {
      // total: totalPrivateVariables,
      ids: privateVariableIds,
    },
  } = data;

  return (
    <View style={styles.container}>
      <Text>{path}</Text>
      <LayerInfo path={path} />

      <Button
        title="remove"
        onPress={() => {
          deleteLayer(`http://${address}${path}`)
            .catch(console.error());
        }}
      />

      <View>
        <Text>{`Config: ${config}`}</Text>
      </View>

      <View>
        <Text>Standard Variables</Text>
        {privateVariableIds.map((variableId) => (
          <React.Fragment key={variableId}>
            <Variable path={`${path}/private_variable/${variableId}`} />
          </React.Fragment>
        ))}
      </View>

      <View>
        <Text>Variables</Text>
        {variableIds.map((variableId) => (
          <React.Fragment key={variableId}>
            <Variable path={`${path}/variable/${variableId}`} />
          </React.Fragment>
        ))}
      </View>

    </View>
  );
}
