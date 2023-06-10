import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';

import {
  useInstanceApi,
  useInstanceOutputStackLayer,
} from 'src/hooks/citySkies';

import {
  LayerConfig,
} from 'src/components/layer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    margin: 5,
    width: '100%',
  },
});

export default function Layer({ stackId, id }) {
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
    privateVariables: {
      // total: totalPrivateVariables,
      ids: privateVariableIds,
    },
  } = data;

  return (
    <View style={styles.container}>
      <LayerConfig config={config} />

      <Button
        title="remove"
        onPress={() => {
          removeOutputStackLayer(stackId, id)
            .catch(console.error);
        }}
      />

      <View>
        <Text>{`Config: ${config}`}</Text>
      </View>

      <View>
        <Text>Standard Variables</Text>
        {privateVariableIds.map((variableId) => (
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
