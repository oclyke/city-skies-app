import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {
  Surface,
  Switch,
} from 'react-native-paper';

import {
  useParams,
} from 'react-router-native';

import {
  withSafeHeaderStyles,
  withSafeFooterStyles,
} from 'src/components/safeRegions';

import {
  useInstanceApi,
  useInstanceOutputStackLayer,
  useInstanceOutputStackLayerVariable,
  useInstanceOutputStackLayerStandardVariable,
} from 'src/hooks/citySkies';

import {
  Variable,
} from 'src/components/variables';

// create a safe header that will bump the content down below the main header
const SafeHeader = withSafeHeaderStyles(View);
const SafeFooter = withSafeFooterStyles(View);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  surface: {
    borderRadius: 10,
    margin: 10,
  },
});

function StandardVariable({ stackId, layerId, variableId }) {
  const [info, loading] = useInstanceOutputStackLayerStandardVariable(stackId, layerId, variableId);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable info={info} />
  );
}

function CustomVariable({ stackId, layerId, variableId }) {
  const [info, loading] = useInstanceOutputStackLayerVariable(stackId, layerId, variableId);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable info={info} />
  );
}

export default function Layer() {
  const {
    stackId,
    layerId,
  } = useParams();

  const [, {
    mergeOutputStackLayerConfig,
  }] = useInstanceApi();

  const [data, loading] = useInstanceOutputStackLayer(stackId, layerId);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    config: {
      shard_uuid: shardId,
      active,
      use_local_palette: useLocalPalette,
    },
    variables: {
      // total: totalVariables,
      ids: variableIds,
    },
    standardVariables: {
      // total: totalPrivateVariables,
      ids: standardVariableIds,
    },
  } = data;

  return (
    <View style={styles.container}>
      <ScrollView>
        <SafeHeader />

        <Surface elevation={2} style={styles.surface}>

          <Text>{`Shard: ${shardId}`}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text>Active: </Text>
            <Switch
              value={active}
              onValueChange={() => {
                mergeOutputStackLayerConfig(stackId, layerId, { active: !active })
                  .catch(console.error);
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text>Use Local Palette: </Text>
            <Switch
              value={useLocalPalette}
              onValueChange={() => {
                mergeOutputStackLayerConfig(stackId, layerId, { use_local_palette: !useLocalPalette })
                  .catch(console.error);
              }}
            />
          </View>

          <Text />
          <Text>Standard Variables</Text>
          {standardVariableIds.map((variableId) => (
            <React.Fragment key={variableId}>
              <StandardVariable stackId={stackId} layerId={layerId} variableId={variableId} />
            </React.Fragment>
          ))}

          <Text />
          <Text>Variables</Text>
          {variableIds.map((variableId) => (
            <React.Fragment key={variableId}>
              <CustomVariable stackId={stackId} layerId={layerId} variableId={variableId} />
            </React.Fragment>
          ))}

        </Surface>

        <SafeFooter />

      </ScrollView>
    </View>
  );
}
