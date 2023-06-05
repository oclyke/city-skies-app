import React from 'react';

import {
  NativeRouter,
  Route,
  Routes,
  Link,
  Navigate,
} from 'react-router-native';

import { StatusBar } from 'expo-status-bar';

import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import useStack from 'src/hooks/stack';

import Connection from 'src/pages/connection';
import Layers from 'src/pages/layers';
import Shards from 'src/pages/shards';

const navUnderlayColor = '#f0f4f7';

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

export default function App() {
  // view stack
  const {
    stack: viewstack,
    ops: { push: pushView, pop: popView },
  } = useStack(['main']);

  return (
    <NativeRouter>
      <View style={styles.container}>
        <SafeAreaView style={styles.main}>
          <StatusBar style="auto" />

          {/* navigation */}
          <View style={styles.nav}>
            <Link
              to="/layers"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Layers</Text>
            </Link>
            <Link
              to="/shards"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Shards</Text>
            </Link>
            <Link
              to="/connection"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Connection</Text>
            </Link>
          </View>

          <Button
            title="Push View Layer"
            onPress={() => pushView('layer')}
          />
          <Button
            title="Pop View Layer"
            onPress={() => popView()}
          />

          <Text>Hi!</Text>
          <Text>
            Stack depth:
            {viewstack.depth}
          </Text>
          {viewstack.map((entry) => (
            <React.Fragment key={`view.${entry}`}>
              <Text>{entry}</Text>
            </React.Fragment>
          ))}

          <Routes>
            <Route path="/connection" element={<Connection />} />
            <Route path="/shards" element={<Shards />} />
            <Route path="/layers" element={<Layers />} />
            <Route index element={<Navigate replace to="/layers" />} />
          </Routes>
        </SafeAreaView>
      </View>
    </NativeRouter>
  );
}
