import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import {
  useParams,
} from 'react-router-native';

import {
  withSafeHeaderStyles,
} from 'src/components/safeHeader';

import {
  useInstanceOutputStackLayer,
  useInstanceOutputStackLayerVariable,
  useInstanceOutputStackLayerStandardVariable,
} from 'src/hooks/citySkies';

import {
  LayerConfig,
} from 'src/components/layer';

import {
  Variable,
} from 'src/components/variables';

// create a safe header that will bump the content down below the main header
const SafeHeader = withSafeHeaderStyles(View);

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

  const [data, loading] = useInstanceOutputStackLayer(stackId, layerId);

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
      // total: totalPrivateVariables,
      ids: standardVariableIds,
    },
  } = data;

  return (
    <View>
      <SafeHeader />
      <LayerConfig config={config} />

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
    </View>
  );
}
