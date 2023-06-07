import React from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Variable from 'src/components/variable';

import {
  usePath,
} from 'src/providers/citySkies';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    margin: 5,
  },
});

function LayerInfo({ path }) {
  const [{
    active,
    id,
    index,
    shard_uuid: shardId,
    use_local_palette: useLocalPalette,
  }, loading] = usePath(path, {
    active: false,
    id: 0,
    index: 0,
    shard_uuid: '',
    use_local_palette: false,
  });

  if (loading) {
    return (
      <Text>Loading</Text>
    );
  }

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

function VariablesList({ path }) {
  const [variables, loading] = usePath(path, []);

  if (loading) {
    return (
      <Text>Loading</Text>
    );
  }

  return (
    <View>
      {variables.map((variableName) => (
        <React.Fragment key={variableName}>
          <Variable path={`${path}/${variableName}`} />
        </React.Fragment>
      ))}
    </View>
  );
}

export default function Layer({ path }) {
  return (
    <View style={styles.container}>
      <Text>{path}</Text>
      <LayerInfo path={`${path}/info`} />

      <View>
        <Text>Standard Variables</Text>
        <VariablesList path={`${path}/private_variables`} />
      </View>

      <View>
        <Text>Variables</Text>
        <VariablesList path={`${path}/variables`} />
      </View>

    </View>
  );
}
