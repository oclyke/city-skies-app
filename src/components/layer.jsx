import React from 'react';

import {
  View,
  Text,
  Button,
} from 'react-native';

import {
  useInstanceApi,
  useInstanceOutputStackLayer,
} from 'src/hooks/citySkies';

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
    config,
    variables: {
      // total: totalVariables,
      ids: variableIds,
    },
    standardVariables: {
      // total: totalStandardVariables,
      ids: standardVariableIds,
    },
  } = data;

  return (
    <View>
      <LayerConfig config={config} />

      <Button
        title="remove"
        onPress={() => {
          removeOutputStackLayer(stackId, id)
            .then(() => console.log('successfully removed layer', id))
            .catch(console.error);
        }}
      />

      <View>
        <Text>{`Config: ${config}`}</Text>
      </View>

      <View>
        <Text>Standard Variables</Text>
        {standardVariableIds.map((variableId) => (
          <React.Fragment key={variableId}>
            <Text>{variableId}</Text>
            {/* <Variable path={`${path}/private_variable/${variableId}`} /> */}
          </React.Fragment>
        ))}
      </View>

      <View>
        <Text>Variables</Text>
        {variableIds.map((variableId) => (
          <React.Fragment key={variableId}>
            <Text>{variableId}</Text>
            {/* <Variable path={`${path}/variable/${variableId}`} /> */}
          </React.Fragment>
        ))}
      </View>

    </View>
  );
}
