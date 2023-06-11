import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import {
  useParams,
} from 'react-router-native';

import {
  useInstanceOutputStackLayer,
  useInstanceOutputStackLayerVariable,
  useInstanceOutputStackLayerStandardVariable,
} from 'src/hooks/citySkies';

import {
  LayerConfig,
} from 'src/components/layer';

function Variable({ data }) {
  const {
    name: id,
  } = data;

  return (
    <Text>{id}</Text>
  );
}

function StandardVariable({ stackId, layerId, variableId }) {
  const [data, loading] = useInstanceOutputStackLayerStandardVariable(stackId, layerId, variableId);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable data={data} />
  );
}

function CustomVariable({ stackId, layerId, variableId }) {
  const [data, loading] = useInstanceOutputStackLayerVariable(stackId, layerId, variableId);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <Variable data={data} />
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
