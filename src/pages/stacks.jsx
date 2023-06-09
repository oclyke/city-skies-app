import React from 'react';

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

import Layer from 'src/components/layer';

import {
  usePath,
} from 'src/providers/citySkies';

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
function Stack({ path }) {
  const [data, loading] = usePath(path);

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    id,
    layers: {
      ids,
    },
  } = data;

  return (
    <>
      <Text>{`Stack: ${id}`}</Text>

      <Text>Layers:</Text>
      <ScrollView>
        {ids.map((layerId) => (
          <React.Fragment key={`layer.${layerId}`}>
            <Layer path={`/api/v0/output/stack/${id}/layer/${layerId}`} />
          </React.Fragment>
        ))}
      </ScrollView>
    </>
  );
}

export default function Stacks() {
  const [data, loading] = usePath('/api/v0/output');

  if (loading === true) {
    return (
      <Text>Loading</Text>
    );
  }

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
        <Route path="active" element={<Stack path={`/api/v0/output/stack/${active}`} />} />
        <Route path="background" element={<Stack path={`/api/v0/output/stack/${inactive}`} />} />
        <Route index element={<Navigate replace to="active" />} />
      </Routes>

    </View>
  );
}
