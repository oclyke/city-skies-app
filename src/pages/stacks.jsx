import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-native';

import useStack from 'src/hooks/citySkies/stack';

import Layer from 'src/components/layer';
import useStackManager from 'src/hooks/citySkies/stackManager';
import { useConnectionState } from 'src/providers/connection';

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
 * @returns Component for navigating between stacks
 */
function StackNavigation() {
  return (
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
  );
}

/**
 * View a stack from the target.
 * @returns Stack component.
 */
function Stack({ id }) {
  const {
    layers: {
      ids: layerIds,
    },
  } = useStack(id);
  const { address } = useConnectionState();

  return (
    <>
      <Text>Stacks page</Text>

      <Text>Stack info:</Text>
      <Text>Remote: {id}</Text>
      {/* <Text>id: {info.id}</Text>
      <Text>layer count: {info.layers.count}</Text> */}

      <Text>Layers:</Text>
      {layerIds.map((layerId) => (
        <React.Fragment key={`layer.${layerId}`}>
          <Layer uri={`http://${address}/stacks/${id}/layers/${layerId}`} />
        </React.Fragment>
      ))}
    </>
  );
}

export default function Stacks() {
  const {
    active,
    inactive,
  } = useStackManager();

  return (
    <View
      style={styles.main}
    >
      <Text>Layers Page</Text>

      {/* stack selection */}
      <StackNavigation />

      {/* active / background stacks rendered under routes */}
      <Routes>
        <Route path="active" element={<Stack id={active} />} />
        <Route path="background" element={<Stack id={inactive} />} />
        <Route index element={<Navigate replace to="active" />} />
      </Routes>

    </View>
  );
}
