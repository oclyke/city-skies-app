import React from 'react';

import {
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
} from 'src/components/safeHeader';

// create a safe header that will bump the content down below the main header
const SafeHeader = withSafeHeaderStyles(View);

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
    <ScrollView>
      <SafeHeader />
      {ids.map((layerId) => (
        <React.Fragment key={`layer.${layerId}`}>
          <TouchableOpacity
            onPress={() => {
              navigate(`/layer/${id}/${layerId}`);
            }}
          >
            <LayerViewStack stackId={id} id={layerId} />
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
