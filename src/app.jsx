import React from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

import {
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-native';

import Connection from 'src/pages/connection';
import Stacks from 'src/pages/stacks';
import Shards from 'src/pages/shards';
import Layer from 'src/pages/layer';

import Navigation from 'src/components/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

/**
 * The global app layout. Provides:
 * - safe area view
 * - global navigation
 *
 * Renders sub-components through outlet.
 *
 * @returns Global layout for the app.
 */
function Layout() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
        <Outlet />
        <Navigation />
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="connection" element={<Connection />} />
        <Route path="shards/*" element={<Shards />} />
        <Route path="stacks/*" element={<Stacks />} />
        <Route path="layer/:stackId/:layerId" element={<Layer />} />
      </Route>
      <Route index element={<Navigate replace to="/stacks" />} />
    </Routes>
  );
}
