import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import {
  useNavigate,
  useParams,
} from 'react-router-native';

import {
  LayerViewStack,
} from 'src/components/layer';

import {
  useInstanceOutputStack,
} from 'src/hooks/citySkies';

import {
  withSafeHeaderStyles,
} from 'src/components/safeRegions';

// create a safe header that will bump the content down below the main header
const SafeHeader = withSafeHeaderStyles(View);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  layer: {
    margin: 10,
  },
});

/**
 * View a stack from the target.
 * @returns Stack component.
 */
function StackView({ id }) {
  const navigate = useNavigate();
  const [data, loading] = useInstanceOutputStack(id);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    // id,
    layers: {
      ids,
    },
  } = data;

  return (
    <ScrollView style={styles.container}>
      <SafeHeader />
      {ids.map((layerId) => (
        <React.Fragment key={`layer.${layerId}`}>
          <TouchableOpacity
            onPress={() => {
              navigate(`/layer/${id}/${layerId}`);
            }}
          >
            <View style={styles.layer}>
              <LayerViewStack stackId={id} id={layerId} />
            </View>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

export default function Stack() {
  const {
    stackId,
  } = useParams();

  return (
    <StackView id={stackId} />
  );
}