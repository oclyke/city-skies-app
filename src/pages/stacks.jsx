import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import {
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-native';

import Layer from 'src/pages/layers';

import {
  useInstanceOutput,
  useInstanceOutputStack,
} from 'src/hooks/citySkies';

const navUnderlayColor = '#f0f4f7';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
});

/**
 * View a stack from the target.
 * @returns Stack component.
 */
function Stack({ id }) {
  const [data, loading] = useInstanceOutputStack(id);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    id: stackId,
    layers: {
      ids,
    },
  } = data;

  return (
    <>
      <Text>{`Stack: ${stackId}`}</Text>

      <Text>Layers:</Text>
      <ScrollView>
        {ids.map((layerId) => (
          <React.Fragment key={`layer.${layerId}`}>
            <Layer stackId={id} id={layerId} />
          </React.Fragment>
        ))}
      </ScrollView>
    </>
  );
}

export default function Stacks() {
  const [data, loading] = useInstanceOutput();

  if (loading) {
    return (
      <Text>Loading</Text>
    );
  }

  // unpack the data
  const {
    stacks: {
      active,
    },
  } = data;
  const inactive = (active === 'A') ? 'B' : 'A';

  return (
    <View
      style={styles.main}
    >
      <Text>Layers Page</Text>

      {/* stack selection */}
      <View style={styles.nav}>
        <Link
          to="/stacks/active"
          underlayColor={navUnderlayColor}
          style={styles.navItem}
        >
          <Text>Active</Text>
        </Link>
        <Link
          to="/stacks/background"
          underlayColor={navUnderlayColor}
          style={styles.navItem}
        >
          <Text>Background</Text>
        </Link>
      </View>

      {/* active / background stacks rendered under routes */}
      <Routes>
        <Route path="active" element={<Stack id={active} />} />
        <Route path="background" element={<Stack id={inactive} />} />
        <Route index element={<Navigate replace to="active" />} />
      </Routes>

    </View>
  );
}
